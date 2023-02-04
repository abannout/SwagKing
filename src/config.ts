const netConfig = {
  rabbitMQ: {
    host: process.env.RABBITMQ_HOST || "localhost",
    port: 5672,
    user: "admin",
    password: "admin",
  },
  game: {
    url: process.env.GAME_URL || "http://localhost:8080",
  },
} as const;

const playerConfig = {
  name: "hackschnitzel",
  email: "hack@schnitzel.org",
} as const;

export const config = {
  player: playerConfig,
  env: {
    mode: process.env.NODE_ENV || "development",
  },
  net: netConfig,
} as const;
