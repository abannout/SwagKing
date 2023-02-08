import { setupInstructor } from "./commander/instructor.js";
import { config } from "./config.js";
import { initializeGame } from "./dev/initializer.js";
import { setupVisualization } from "./dev/visualization.js";
import * as client from "./net/client.js";
import { getGames, registerForGame } from "./net/client.js";
import * as relay from "./net/relay.js";
import { setupStateHandlers } from "./state/handlers.js";
import { bank, fleet, map, price, radar } from "./state/state.js";
import { ResGetGame } from "./types";
import logger from "./utils/logger.js";
import { untilAsync } from "./utils/utils.js";

// #region Setup
const player = await client.fetchOrUpdatePlayer(
  config.player.name,
  config.player.email
);
client.defaults.player = player.playerId;

type GameRegistration = {
  gameId: string;
  playerId: string;
  playerQueue: string;
};

async function registerForNextAvailableGame(): Promise<GameRegistration> {
  const isParticipating = (game: ResGetGame) =>
    game.participatingPlayers.includes(player.name);
  const canRegister = (game: ResGetGame) =>
    game.gameStatus === "created" && !isParticipating(game);

  // Wait until we have a game we can register for
  await untilAsync(
    async () =>
      (await getGames()).some((g) => canRegister(g) || isParticipating(g)),
    500
  );
  const games = await getGames();
  const game = games.find((g) => canRegister(g) || isParticipating(g));
  if (!game) {
    // Shouldn't happen
    throw new Error("No game found");
  }

  logger.info(`Registering for game: ${game.gameId}`);

  let playerQueue = `player-${player.playerId}`;
  if (!isParticipating(game)) {
    const gameRegistration = await registerForGame(game.gameId);
    playerQueue = gameRegistration.playerQueue;
  }

  logger.info(`Playing in game: ${game.gameId}`);
  client.defaults.game = game.gameId;
  relay.setupRelay(playerQueue, { playerId: player.playerId });

  return {
    gameId: game.gameId,
    playerId: player.playerId,
    playerQueue,
  };
}

const isInDevMode = config.env.mode === "development";

if (isInDevMode) {
  logger.debug("Running in development mode...");
  logger.debug("Intializing game...");
  await initializeGame(true);
}

const registration = await registerForNextAvailableGame();

if (isInDevMode) {
  logger.debug("Starting game");
  await client.startGame(registration.gameId);
}

// #endregion

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
  logger.info(
    `Game ${event.payload.gameId} switched to status: ${event.payload.status}`
  );
});

relay.on("error", (event) => {
  logger.error(event, "Error event received");
});

// -----------------------------
// Crucial Fallback Handlers
// -----------------------------

relay.on("game-status", async (event) => {
  const { payload } = event;
  if (payload.status !== "ended") return;

  bank.clear();
  fleet.clear();
  map.clear();
  price.clear();
  radar.clear();
  await registerForNextAvailableGame();
});

setupInstructor();

if (isInDevMode) {
  setupVisualization();
}

// Needs to be called near the end.
relay.setupCommandCleanup();
