import { createGame, endGame, getGames, setRoundDuration } from "../net/client";
import logger from "../utils/logger";
import { ResGetGame } from "../types";

const cRounds = 10_000;
const cPlayers = 10;
const cRoundDuration = 4_000;

export async function initializeGame(force: boolean = false) {
  const games: Pick<ResGetGame, "gameId" | "gameStatus">[] = await getGames();
  const runningGames = games.filter((g) => g.gameStatus === "started");
  const createdGames = games.filter((g) => g.gameStatus === "created");

  if (runningGames.length > 0) {
    if (!force) {
      logger.info("A game is already running, skipping initialization");
      return;
    }
    logger.info("At least one game is already running, stopping all");
    await Promise.all(runningGames.map((g) => endGame(g.gameId)));
  }

  const gameIds = createdGames.map((g) => g.gameId);

  if (createdGames.length === 0) {
    logger.info("No game is available, creating a new one");
    const game = await createGame(cRounds, cPlayers);
    logger.info(`Game created: ${game.gameId}`);
    gameIds.push(game.gameId);
  }

  await Promise.all(gameIds.map((g) => setRoundDuration(g, cRoundDuration)));
}
