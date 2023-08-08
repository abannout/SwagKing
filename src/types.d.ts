// -------------------------------
// Utils
// -------------------------------
export type Awaitable<T> = T | PromiseLike<T>;

// -------------------------------
// Game HTTP Definitions
// -------------------------------

export type ReqCreatePlayer = {
  name: string;
  email: string;
};

export type ReqCreateGame = {
  maxRounds: number;
  maxPlayers: number;
};

export type ReqUpdateMaxRounds = {
  maxRounds: number;
};

export type ReqUpdateRoundDuration = {
  duration: number;
};

export type ResCreatePlayer = {
  playerId: string;
  name: string;
  email: string;
};

export type ResGetGame = {
  gameId: string;
  gameStatus: GameStatus;
  participatingPlayers: string[];
};

export type ResRegisterGame = {
  gameExchange: string;
  playerQueue: string;
};

export type ResCreateGame = {
  gameId: string;
};

// -------------------------------
// Game Constants
// -------------------------------

export type GameStatus = "created" | "started" | "ended";
export type RoundStatus = "started" | "command input ended" | "ended";
export type CommandType =
  | "mining"
  | "movement"
  | "battle"
  | "buying"
  | "selling"
  | "regenerate";

// -------------------------------
// Eventing
// -------------------------------
export type GameEventType = "round-status" | "status";

export type ErrorEventType = "error";

export type EventType = keyof ClientEvents; // TODO: I really want to use the union type above as EventType and reflect it into ClientEvents

export type EventHeaders = {
  eventId: string;
  type: EventType;
  timestamp: string;
  "kafka-topic": string;
};

export type GameEvent<T> = {
  headers: EventHeaders;
  payload: T;
};

export interface ClientEvents {
  "round-status": EventRoundStatusPayload;
  error: ErrorEvent;
}

export type ErrorEvent = {
  playerId: string;
  transactionId: string;
  robotId: string;
  description: string;
  code: string;
};

export type EventRoundStatusPayload = {
  gameId: string;
  roundNumber: number;
  roundId: string;
  roundStatus: RoundStatus;
};

// -------------------------------
// Commands
// -------------------------------
export type GameCommand = BuyRobotCommand | GameCommand;

type BaseCommand<T extends BaseCommandObject> = {
  playerId: string;
  robotId: string | null;
  commandType: CommandType;
  commandObject: T;
};

type BaseCommandObject = {
  commandType: CommandType;
  planetId: string | null;
  targetId: string | null;
  itemName: Tradable | null;
  itemQuantity: number | null;
};

export type BuyRobotCommandObject = Pick<BaseCommandObject, "commandType"> & {
  itemName: "ROBOT";
  itemQuantity: number;
};

export type BuyRobotCommand = Omit<
  BaseCommand<BuyRobotCommandObject>,
  "robotId"
> & {
  commandType: "buying";
};

export type BuyCommandObject = Pick<BaseCommandObject, "commandType"> & {
  itemName: Tradable;
  itemQuantity: number;
};

export type BuyCommand = BaseCommand<BuyCommandObject> & {
  commandType: "buying";
};

export type GameRegistration = {
  gameId: string;
  playerId: string;
  playerQueue: string;
};
