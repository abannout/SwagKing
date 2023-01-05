import { getGames, registerForGame } from "./net/client";
import { untilAsync } from "./utils/utils";
import {
  ResGetGame,
} from "./types";
import * as client from "./net/client";
import logger from "./utils/logger";
import { initializeGame } from "./dev/initializer";
import context from "./context";
import * as relay from "./net/relay";
import { setupStateHandlers } from "./state/handlers";

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
context.player.playerQueue = playerQueue;

if (isInDevMode) {
  logger.debug("Starting game");
  await client.startGame(game.gameId);
}

// Oh Gosh this is hacky
type CommandFunction = () => Promise<void>;
let commands: Record<string, CommandFunction> = {};

relay.setupRelay(context);

// -----------------------------
// Handlers
// -----------------------------
setupStateHandlers();

// -----------------------------
// Logging Handlers
// -----------------------------
relay.on("round-status", async (event) => {
  const round = event.payload;
  logger.info(
    `Round ${round.roundNumber} switched to status: ${round.roundStatus}`
  );
});

relay.on("game-status", (event) => {
  logger.info(`Game ${event.payload.gameId} switched to status: ${event.payload.status}`);
});

relay.on("error", (event) => {
  logger.error(event, "Error event received");
});
