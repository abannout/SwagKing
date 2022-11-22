import { fetchOrUpdatePlayer, getGames, registerForGame } from "./client";
import { untilAsync } from "./utils";
import * as amqplib from "amqplib";
import {
  BuyRobotCommand,
  EventHeaders,
  EventRobotSpawned,
  EventRoundStatusPayload,
  EventType,
  MineCommand,
  PlanetDiscovered,
  ResGetGame,
} from "./types";
import * as client from "./client";
import logger from "./logger";
import { initializeGame } from "./dev/initializer";
import fleet from "./fleet";
import map from "./map";
import { buyRobots, mine, moveToRandomNeighbour } from "./commands";
import context from "./context";

const isInDevMode = context.env.mode === "development";

const player = await fetchOrUpdatePlayer(
  context.player.name,
  context.player.email
);
client.defaults.player = player.playerId;

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

let playerQueue = `player-${player.playerId}`;
if (!isParticipating(game)) {
  const gameRegistration = await registerForGame(game.gameId, player.playerId);
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

const handlers: Record<EventType, HandlerFn> = {
  "round-status": handleRoundStatusEvent,
  RobotSpawned: handleRobotSpawnedEvent,
  "planet-discovered": handlePlanetDiscoveredEvent,
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
    await moveToRandomNeighbour(robot);
  } else {
    await mine(robot);
  }
}

async function handleRoundStatusEvent<T extends EventRoundStatusPayload>(
  event: T
) {
  if (event.roundStatus === "started") {
    await buyRobots(1);
  }
}