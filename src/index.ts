import { config } from "./config.js"
import { initializeGame } from "./common/dev/initializer.js"
import * as client from "./common/net/client.js"
import { getGames, registerForGame } from "./common/net/client.js"
import * as relay from "./common/net/relay.js"
import { setupStateHandlers } from "./state/state.js"
import { GameRegistration, ResGetGame } from "./common/types.js"
import logger from "./utils/logger.js"
import { untilAsync } from "./utils/utils.js"
import strategy from "./strategy.js"

// To allow better debugging, we register process event handlers that simply log debugging
// information to the console
process.on("unhandledRejection", (err) => {
  logger.error(`Unhandled rejection: ${err}`)
})
process.on("uncaughtException", (err, origin) => {
  logger.error(
    `Uncaught exception (origin: ${origin}) err: ${err}\t at ${err.stack}`
  )
})
process.on("SIGTERM", (signal) => logger.error(`Received Sigterm: ${signal}`))
process.on("beforeExit", (code) => {
  logger.warn(`Process will exit with code: ${code}`)
  process.exit(code)
})
process.on("exit", (code) => {
  logger.warn(`Process exited with code: ${code}`)
})

// When our player is started, the first thing we need to do is obtaining our credentials.
const player = await client.fetchOrUpdatePlayer(
  config.player.name,
  config.player.email
)
client.defaults.player = player.playerId

async function registerForNextAvailableGame(): Promise<GameRegistration> {
  const isParticipating = (game: ResGetGame) =>
    game.participatingPlayers.includes(player.name)
  const canRegister = (game: ResGetGame) =>
    game.gameStatus === "created" && !isParticipating(game)

  // Wait until we have a game we can register for
  await untilAsync(
    async () =>
      (await getGames()).some((g) => canRegister(g) || isParticipating(g)),
    500
  )
  const games = await getGames()
  const game = games.find((g) => canRegister(g) || isParticipating(g))
  if (!game) {
    // Shouldn't happen
    throw new Error("No game found")
  }

  logger.info(`Registering for game: ${game.gameId}`)
  logger.info("Mode is: " + config.env.mode)
  if (!isParticipating(game)) {
    await registerForGame(game.gameId)
  }

  logger.info(`Playing in game: ${game.gameId}`)
  relay.setupRelay({
    playerId: player.playerId,
    playerExchange: player.playerExchange,
  })

  return {
    gameId: game.gameId,
    playerId: player.playerId,
    playerExchange: player.playerExchange,
  }
}

// When we are in devmode, we can create a game on our own.
// This allows faster feedback during development
const isInDevMode = config.env.mode === "development"
if (isInDevMode) {
  logger.debug("Running in development mode...")
  logger.debug("Intializing game...")
  await initializeGame(true)
}

const registration = await registerForNextAvailableGame()

if (isInDevMode) {
  logger.debug("Starting game")
  await client.startGame(registration.gameId)
}

// -----------------------------
// Handlers
// -----------------------------
setupStateHandlers()
strategy()
// connectToNeo4j()
// -----------------------------
// Logging Handlers
// -----------------------------
relay.on("error", (event) => {
  logger.error(event, "Error event received")
})
