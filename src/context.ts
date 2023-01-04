import axios from "axios";
import { defaults, fetchOrUpdatePlayer } from "./net/client";

export type Context = {
  player: {
    name: string;
    email: string;
    id: string;
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

const netContext = {
  rabbitMQ: {
    host: process.env.RABBITMQ_HOST || "localhost",
    port: 5672,
    user: "admin",
    password: "admin",
  },
  game: {
    url: process.env.GAME_URL || "http://localhost:8080",
  },
};

const playerCredentials = {
  name: "hackschnitzel",
  email: "hack@schnitzel.org",
};

async function createContext(): Promise<Context> {
  const player = await fetchOrUpdatePlayer(
    playerCredentials.name,
    playerCredentials.email
  );
  defaults.player = player.playerId;

  return {
    player: {
      ...playerCredentials,
      id: player.playerId,
    },
    env: {
      mode: process.env.NODE_ENV || "development",
    },
    net: {
      ...netContext,
    },
  } as const as Context;
}

export default await createContext();
