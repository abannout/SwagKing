import { getGames, registerForGame } from "./net/client";
import { untilAsync } from "./utils/utils";
import * as amqplib from "amqplib";
import {
  EventHeaders,
  ResGetGame,
} from "./types";
import * as client from "./net/client";
import logger from "./utils/logger";
import { initializeGame } from "./dev/initializer";
import fleet from "./state/fleet";
import map from "./state/map";
import { buyRobots, moveTo } from "./commands";
import context from "./context";
import { EventRelay } from "./net/relay";

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

// Oh Gosh this is hacky
type CommandFunction = () => Promise<void>;
let commands: Record<string, CommandFunction> = {};
const relay = new EventRelay();

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

    relay.emit(headers.type, {
      headers,
      payload: event
    });

    channel.ack(msg);
  } else {
    logger.info("Consumer cancelled by server");
  }
});

// -----------------------------
// Handlers
// -----------------------------
relay.on("RobotSpawned", (event) => {
  logger.info("Robot spawned!");
  const { robot } = event.payload;
  fleet.add(robot);
  map.setRobot(robot.id, robot.planet.planetId);
});

relay.on("planet-discovered", async (event) => {
  logger.info("Planet Discovered!");
  const planet = event.payload;
  map.setPlanet(planet);
  await map.draw();

  const robot = fleet.first();
  if (!robot) {
    throw new Error("No Robot in fleet. Perhaps it has been killed?");
  }

  if (!planet) {
    const randomNeighbour = map.getRandomNeighbour(planet)!;
    commands[robot.id] = () => moveTo(robot, randomNeighbour);
  } else {
    // commands.push(() => mine(robot));
  }
});

relay.on("RobotInventoryUpdated", (event) => {
  logger.info("Robot Inventory updated!");
  logger.info(event);

  const robot = fleet.first();

  if (!robot) {
    throw new Error("No Robot in fleet. Perhaps it has been killed?");
  }

  // commands.push(() => sell(robot));
});

relay.on("round-status", async (event) => {
  const round = event.payload;
  logger.info(
    `Round ${round.roundNumber} switched to status: ${round.roundStatus}`
  );

  if (fleet.size() === 0 && round.roundStatus === "started") {
    commands[""] = () => buyRobots(1);
  }

  if (round.roundStatus === "started") {
    await Promise.all(Object.values(commands).map((c) => c()));
    commands = {};
  }

  const robot = fleet.first();

  if (robot) {
    // await sell(robot);
    // await moveToRandomNeighbour(robot);
    // const randomNeighbour = map.getRandomNeighbour(robot.planet.planetId)!;
    // commands[robot.id] = () => moveTo(robot, randomNeighbour);
  }
});

relay.on("RobotMoved", (event) => {
  logger.info(`Robot ${event.payload.robot} moved to planet ${event.payload.fromPlanet}`);
  map.moveRobot(event.payload.robot, event.payload.fromPlanet, event.payload.toPlanet);
});

relay.on("game-status", (event) => {
  logger.info(`Game ${event.payload.gameId} switched to status: ${event.payload.status}`);
});

relay.on("error", (event) => {
  logger.error(event, "Error event received");
});
