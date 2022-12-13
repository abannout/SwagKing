import { fetchOrUpdatePlayer, getGames, registerForGame } from "./client";
import { untilAsync } from "./utils";
import * as amqplib from "amqplib";
import {
  BuyRobotCommand,
  EventGameStatusPayload,
  EventHeaders,
  EventRobotSpawned,
  EventRoundStatusPayload,
  EventType,
  MineCommand,
  PlanetDiscovered,
  ResGetGame,
  RobotInventoryUpdated,
} from "./types";
import * as client from "./client";
import logger from "./logger";
import { initializeGame } from "./dev/initializer";
import fleet from "./fleet";
import map from "./map";
import { buyRobots, mine, moveToRandomNeighbour, sell } from "./commands";
import context from "./context";

const isInDevMode = context.env.mode === "development";

if (isInDevMode) {
  logger.debug("Running in development mode...");
  logger.debug("Intializing game...");
  await initializeGame(true);
}

const isParticipating = (game: ResGetGame) =>
  game.participatingPlayers.includes(context.player.name);
const canRegister = (game: ResGetGame) =>
  game.gameStatus === "created" && !isParticipating(game);

await untilAsync(
  async () =>
    (await getGames()).some((g) => canRegister(g) || isParticipating(g)),
  500
);

const games = await getGames();
const game = games.find((g) => canRegister(g) || isParticipating(g));

if (!game) {
  throw new Error("No game found");
}

logger.info(`Playing in game: ${game.gameId}`);
client.defaults.game = game.gameId;

let playerQueue = `player-${context.player.id}`;
if (!isParticipating(game)) {
  const gameRegistration = await registerForGame(game.gameId);
  playerQueue = gameRegistration.playerQueue;
}

if (isInDevMode) {
  logger.debug("Starting game");
  await client.startGame(game.gameId);
}

const { rabbitMQ } = context.net;
const conn = await amqplib.connect(
  `amqp://${rabbitMQ.user}:${rabbitMQ.password}@${rabbitMQ.host}:${rabbitMQ.port}`
);

const channel = await conn.createChannel();
await channel.assertQueue(playerQueue);

type HandlerFn = (event: any) => Promise<void>;

// Oh Gosh this is hacky
type CommandFunction = () => Promise<void>;
const commands: Array<CommandFunction> = [];
const handlers: Record<EventType, HandlerFn> = {
  "round-status": handleRoundStatusEvent,
  status: handleGameStatusEvent,
  RobotSpawned: handleRobotSpawnedEvent,
  RobotInventoryUpdated: handleRobotInventoryUpdatedEvent,
  "planet-discovered": handlePlanetDiscoveredEvent,
  error: handleErrorEvent,
};

channel.consume(playerQueue, async (msg) => {
  if (msg !== null) {
    const event = JSON.parse(msg.content.toString());
    const headers: EventHeaders = Object.entries(msg.properties.headers)
      .map(([key, value]) => ({ key, value: value.toString() }))
      .reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {}) as any;

    logger.debug({
      headers,
      event,
    });

    const handler = handlers[headers.type];
    if (handler !== undefined) {
      await handler(event);
    }

    channel.ack(msg);
  } else {
    logger.info("Consumer cancelled by server");
  }
});

// -----------------------------
// Handlers
// -----------------------------
async function handleRobotSpawnedEvent(event: EventRobotSpawned) {
  logger.info("Robot spawned!");
  fleet.add(event.robot);
}

async function handlePlanetDiscoveredEvent(event: PlanetDiscovered) {
  logger.info("Planet Discovered!");
  map.set(event);

  const robot = fleet.first();

  if (!robot) {
    throw new Error("No Robot in fleet. Perhaps it has been killed?");
  }

  if (!event.resource) {
    logger.info("No resource on planet. Moving to next planet");
    commands.push(() => moveToRandomNeighbour(robot));
  } else {
    commands.push(() => mine(robot));
  }
}

async function handleRobotInventoryUpdatedEvent(event: RobotInventoryUpdated) {
  logger.info("Robot Inventory updated!");
  logger.info(event);

  const robot = fleet.first();

  if (!robot) {
    throw new Error("No Robot in fleet. Perhaps it has been killed?");
  }

  commands.push(() => sell(robot));
}

async function handleRoundStatusEvent<T extends EventRoundStatusPayload>(
  event: T
) {
  logger.info(
    `Round ${event.roundNumber} switched to status: ${event.roundStatus}`
  );
  if (fleet.size() === 0 && event.roundStatus === "started") {
    commands.push(() => buyRobots(1));
  }

  if (event.roundStatus === "started") {
    await Promise.all(commands.map((c) => c()));
  }

  const robot = fleet.first();

  if (robot) {
    // await sell(robot);
    // await moveToRandomNeighbour(robot);
  }
}

async function handleGameStatusEvent<T extends EventGameStatusPayload>(
  event: T
) {
  logger.info(`Game ${event.gameId} switched to status: ${event.status}`);
}

async function handleErrorEvent(event: any) {
  logger.error(event, "Error event received");
}
