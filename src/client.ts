import axios, { AxiosError } from "axios";
import type {
  GameCommand,
  ResCreatePlayer,
  ResGetGame,
  ResRegisterGame,
} from "./types";

const gameUrl = process.env.GAME_URL;
axios.defaults.baseURL = gameUrl;
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common["Accept"] = "application/json";

type ClientDefaults = {
  player: string | null;
  game: string | null;
};

export const defaults: ClientDefaults = {
  player: null,
  game: null,
};

export async function registerPlayer(
  name: string,
  email: string
): Promise<ResCreatePlayer> {
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
    return player;
  } catch (error: any | AxiosError) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return registerPlayer(name, email);
      }
    }
    throw error;
  }
}

export async function getGames(): Promise<ResGetGame[]> {
  return axios.get<ResGetGame[]>("/games").then((res) => res.data);
}

export async function registerForGame(
  gameId: string,
  playerId: string
): Promise<ResRegisterGame> {
  return axios
    .put<ResRegisterGame>(`/games/${gameId}/players/${playerId}`)
    .then((res) => res.data);
}

export async function sendCommand<T extends GameCommand>(
  command: Omit<T, "playerId" | "gameId">
): Promise<void> {
  if (!defaults.player) {
    throw new Error("No player set");
  }
  if (!defaults.game) {
    throw new Error("No game set");
  }

  await axios.post<unknown, unknown, GameCommand>("/commands", {
    ...command,
    gameId: defaults.game,
    playerId: defaults.player,
  });
}
