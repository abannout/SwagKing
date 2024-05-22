import axios, { AxiosError } from "axios";
import type {
  GameCommand,
  ResCreateGame,
  ResCreatePlayer,
  ResGetGame,
} from "../types";
import logger from "../utils/logger.js";

type ClientDefaults = {
  player: string | null;
};

axios.defaults.baseURL = process.env.GAME_URL ?? "http://localhost:8080";
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common["Accept"] = "application/json";

axios.interceptors.request.use(
  (config) => {
    logger.trace(`Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    if (error instanceof AxiosError) {
      logger.error(`Request error: ${JSON.stringify(error.request?.data)}`);
    } else {
      logger.error(`Request error: ${error}`);
    }
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    logger.trace(`Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error instanceof AxiosError) {
      logger.error(`Response error: ${JSON.stringify(error.response?.data)}`);
    } else {
      logger.error(`Response error: ${error}`);
    }
    return Promise.reject(error);
  }
);

export const defaults: ClientDefaults = {
  player: null,
};

export async function registerPlayer(
  name: string,
  email: string
): Promise<ResCreatePlayer> {
  logger.info("player created: " + name);
  return axios
    .post<ResCreatePlayer>("/players", {
      name,
      email,
    })
    .then((res) => res.data);
}

export async function getPlayer(
  name: string,
  email: string
): Promise<ResCreatePlayer> {
  return axios
    .get<ResCreatePlayer>("/players", {
      params: {
        name,
        mail: email,
      },
    })
    .then((res) => res.data);
}

export async function fetchOrUpdatePlayer(
  name: string,
  email: string
): Promise<ResCreatePlayer> {
  try {
    const player = await getPlayer(name, email);
    logger.info("player found: " + name);
    return player;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return registerPlayer(name, email);
      }
    }
    throw error;
  }
}

export async function createGame(
  maxRounds: number,
  maxPlayers: number
): Promise<ResCreateGame> {
  return axios
    .post<ResCreateGame>("/games", {
      maxRounds,
      maxPlayers,
    })
    .then((res) => res.data);
}

export async function setRoundDuration(
  gameId: string,
  duration: number
): Promise<unknown> {
  return axios
    .patch<unknown>(`/games/${gameId}/duration`, {
      duration,
    })
    .then((res) => res.data);
}

export async function startGame(gameId: string): Promise<unknown> {
  return axios
    .post<unknown>(`/games/${gameId}/gameCommands/start`)
    .then((res) => res.data);
}

export async function endGame(gameId: string): Promise<unknown> {
  return axios
    .post<unknown>(`/games/${gameId}/gameCommands/end`)
    .then((res) => res.data);
}

export async function getGames(): Promise<ResGetGame[]> {
  return axios.get<ResGetGame[]>("/games").then((res) => res.data);
}

export async function registerForGame(gameId: string): Promise<void> {
  axios.put<void>(`/games/${gameId}/players/${defaults.player}`);
}

export async function sendCommand<T extends GameCommand>(
  commandToSend: Omit<T, "playerId">
): Promise<void> {
  if (!defaults.player) {
    throw new Error("No player set");
  }

  await axios.post<unknown, unknown, any>("/commands", {
    playerId: defaults.player,
    type: commandToSend.type,
    data: {
      ...commandToSend.data,
    },
  });
}
