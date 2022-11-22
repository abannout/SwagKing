export type Context = {
  player: {
    name: string;
    email: string;
  };
  env: {
    mode: string;
  };
  net: {
    rabbitMQ: {
      host: string;
      port: number;
      user: string;
      password: string;
    };
    game: {
      url: string;
    };
  };
};

const playerCredentials = {
  name: "hackschnitzel",
  email: "hack@schnitzel.org",
};

export default {
  player: {
    ...playerCredentials,
  },
  env: {
    mode: process.env.NODE_ENV || "development",
  },
  net: {
    rabbitMQ: {
      host: process.env.RABBITMQ_HOST || "localhost",
      port: 5672,
      user: "admin",
      password: "admin",
    },
    game: {
      url: process.env.GAME_URL || "http://localhost:8080",
    },
  },
} as const as Context;
