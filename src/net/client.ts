import axios from "axios";
import type {
  GameCommand,
  ResCreateGame,
  ResCreatePlayer,
  ResGetGame,
  ResRegisterGame,
} from "../types";

type ClientDefaults = {
  player: string | null;
  game: string | null;
};

axios.defaults.baseURL = process.env.GAME_URL || "http://localhost:8080";
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common["Accept"] = "application/json";

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

export async function registerForGame(
  gameId: string
): Promise<ResRegisterGame> {
  return axios
    .put<ResRegisterGame>(`/games/${gameId}/players/${defaults.player}`)
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
