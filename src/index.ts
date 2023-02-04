import { buyRobots, mine, moveTo, regenerate, sell } from "./commands";
import context from "./context";
import { initializeGame } from "./dev/initializer";
import * as client from "./net/client";
import { getGames, registerForGame } from "./net/client";
import * as relay from "./net/relay";
import bank from "./state/bank";
import fleet, { FleetedRobot } from "./state/fleet";
import { setupStateHandlers } from "./state/handlers";
import map from "./state/map";
import price from "./state/price";
import { ResGetGame } from "./types";
import logger from "./utils/logger";
import { untilAsync } from "./utils/utils";

// #region Setup

client.defaults.player = context.player.id;

type GameRegistration = {
  gameId: string;
  playerId: string;
  playerQueue: string;
};

async function registerForNextAvailableGame(): Promise<GameRegistration> {
  const isParticipating = (game: ResGetGame) =>
    game.participatingPlayers.includes(context.player.name);
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

  let playerQueue = `player-${context.player.id}`;
  if (!isParticipating(game)) {
    const gameRegistration = await registerForGame(game.gameId);
    playerQueue = gameRegistration.playerQueue;
  }
  return {
    gameId: game.gameId,
    playerId: context.player.id,
    playerQueue,
  };
}

function patchContext(registration: GameRegistration) {
  logger.info(`Playing in game: ${registration.gameId}`);
  client.defaults.game = registration.gameId;
  context.player.playerQueue = registration.playerQueue;
}

const isInDevMode = context.env.mode === "development";

if (isInDevMode) {
  logger.debug("Running in development mode...");
  logger.debug("Intializing game...");
  await initializeGame(true);
}

const registration = await registerForNextAvailableGame();
patchContext(registration);

if (isInDevMode) {
  logger.debug("Starting game");
  await client.startGame(registration.gameId);
}

relay.setupRelay(context);

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

// If we don't have any robot in our fleet we must buy one.
relay.on("round-status", (event) => {
  if (fleet.size() > 0) return;
  if (event.payload.roundStatus !== "started") return;

  logger.info("Fleet eliminated, trying to buy a new robot");
  relay.enqueue(() => buyRobots(5));
});

relay.on("game-status", (event) => {
  const { payload } = event;
  if (payload.status !== "ended") return;

  bank.clear();
  fleet.clear();
  map.clear();
  price.clear();
});

// TODO: This is not an ideal implementation of a strategy or anything like it.
// I probably want to make it a bit more sophisticated. But for the moment I just want
// to explore the whole map
relay.on("PlanetDiscovered", (event) => {
  const { payload } = event;
  const robots = map
    .getRobotsOnPlanet(payload.planet)
    .map((r) => fleet.get(r))
    .filter((r) => r !== undefined) as FleetedRobot[];

  for (const robot of robots) {
    if (robot.energy < payload.movementDifficulty) {
      relay.enqueue(() => regenerate(robot));
    } else if (payload.resource?.resourceType === "COAL") {
      relay.enqueue(() => mine(robot));
    } else {
      const p = map.shortestPathToUnknownPlanet(payload.planet);
      if (p === null || p.length < 1) return;

      relay.enqueue(() => moveTo(robot, p[1]));
    }
  }
});

relay.on("RobotResourceMinedIntegrationEvent", (event) => {
  const { payload } = event;
  const robot = fleet.get(payload.robotId);

  if (!robot) {
    return;
  }

  if (robot.inventory.COAL > 0) {
    relay.enqueue(() => sell(robot));
  }
});

// Needs to be called near the end.
relay.setupCommandCleanup();
