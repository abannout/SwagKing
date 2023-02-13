const netConfig = {
  rabbitMQ: {
    host: process.env.RABBITMQ_HOST || "localhost",
    port: Number(process.env.RABBITMQ_PORT) || 5672,
    user: process.env.RABBITMQ_USER || "admin",
    password: process.env.RABBITMQ_PASSWORD || "admin",
  },
  game: {
    url: process.env.GAME_URL || "http://localhost:8080",
  },
};

const playerConfig = {
  name: process.env.PLAYER_NAME || "hackschnitzel",
  email: process.env.PLAYER_EMAIL || "hack@schnitzel.org",
};

export const config = {
  player: playerConfig,
  env: {
    mode: process.env.NODE_ENV || "development",
  },
  logging: {
    enableVisualization:
      String(process.env.LOGGING_VISUALIZATION) === "true" || true,
    dir: process.env.LOGGING_DIR || "logs",
    level: process.env.LOGGING_LEVEL || "debug",
  },
  net: netConfig,
};
