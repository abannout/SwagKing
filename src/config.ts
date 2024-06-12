const netConfig = {
  rabbitMQ: {
    host: process.env.RABBITMQ_HOST ?? "localhost",
    port: Number(process.env.RABBITMQ_PORT ?? 5672),
    user: process.env.RABBITMQ_USER ?? "admin",
    password: process.env.RABBITMQ_PASSWORD ?? "admin",
  },
  game: {
    url: process.env.GAME_URL ?? "http://localhost:8080",
  },
}

const playerConfig = {
  name: process.env.PLAYER_NAME ?? "player-SwagKingTheThird", // ! TODO: Change this to your player name
  email: process.env.PLAYER_EMAIL ?? "ahmadbannout.ab@gmail.com", // ! TODO: Change this to your email
}

export const config = {
  player: playerConfig,
  env: {
    mode: process.env.NODE_ENV ?? "development",
  },
  logging: {
    dir: process.env.LOGGING_DIR ?? "logs",
    level: process.env.LOGGING_LEVEL ?? "debug",
  },
  net: netConfig,
}
