import { fetchOrUpdatePlayer, getGames, registerForGame } from "./client";
import { untilAsync } from "./utils";
import * as amqplib from "amqplib";
import type {
  BuyRobotCommand,
  EventRoundStatusPayload,
  ResGetGame,
} from "./types";
import * as client from "./client";
import logger from "./logger";
import { initializeGame } from "./dev/initializer";

const playerName = "hackschnitzel";
const playerEmail = "hack@schnitzel.org";
const rabbitMQHost = process.env.RABBITMQ_HOST || "localhost";
const rabbitMQPort = 5672;
const rabbitMQUser = "admin";
const rabbitMQPassword = "admin";

const isInDevMode = process.env.NODE_ENV !== "production";

const player = await fetchOrUpdatePlayer(playerName, playerEmail);
client.defaults.player = player.playerId;

if (isInDevMode) {
  logger.debug("Running in development mode...");
  logger.debug("Intializing game...");
  await initializeGame(true);
}

const isParticipating = (game: ResGetGame) =>
  game.participatingPlayers.includes(playerName);
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

const conn = await amqplib.connect(
  `amqp://${rabbitMQUser}:${rabbitMQPassword}@${rabbitMQHost}:${rabbitMQPort}`
);

const channel = await conn.createChannel();
await channel.assertQueue(playerQueue);

channel.consume(playerQueue, async (msg) => {
  if (msg !== null) {
    const event = JSON.parse(msg.content.toString());
    const headers: any = Object.entries(msg.properties.headers)
      .map(([key, value]) => ({ key, value: value.toString() }))
      .reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {});
    logger.debug({
      headers,
      event,
    });

    if (headers.type === "round-status") {
      const roundStatusEvent = event as EventRoundStatusPayload;
      if (roundStatusEvent.roundStatus === "started") {
        await client.sendCommand<BuyRobotCommand>({
          commandType: "buying",
          commandObject: {
            commandType: "buying",
            itemName: "robot",
            itemQuantity: 1,
          },
        });
      }
    }

    channel.ack(msg);
  } else {
    logger.info("Consumer cancelled by server");
  }
});
