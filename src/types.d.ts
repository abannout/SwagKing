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

export type GameRegistration = {
  gameId: string;
  playerId: string;
  playerQueue: string;
};

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

export type BaseCommand<K extends CommandType, T extends CommandData> = {
  playerId: string;
  type: K;
  data: T;
};
type CommandData =
  | BattleCommandData
  | BuyTradableCommandData
  | MineCommandData
  | MoveCommandData
  | RegenerateCommandData
  | SellTradablesCommandData;
type BattleCommandData = {
  robotId: string;
  targetId: string;
};
type BattleCommand = BaseCommand<"battle", BattleCommandData>;
type BuyTradableCommandData = {
  robotId: string | null;
  itemName: string;
  itemQuantity: number;
};
type BuyTradableCommand = BaseCommand<"buying", BuyTradableCommandData>;
type MineCommandData = {
  robotId: string;
};
type MineCommand = BaseCommand<"mining", MineCommandData>;
type MoveCommandData = {
  robotId: string;
  planetId: string;
};
type MoveCommand = BaseCommand<"movement", MoveCommandData>;
type RegenerateCommandData = {
  robotId: string;
};
type RegenerateCommand = BaseCommand<"regenerate", RegenerateCommandData>;
type SellTradablesCommandData = {
  robotId: string;
};
type SellTradablesCommand = BaseCommand<"selling", SellTradablesCommandData>;

export type GameCommand =
  | BattleCommand
  | BuyTradableCommand
  | MineCommand
  | MoveCommand
  | RegenerateCommand
  | SellTradablesCommand;

export type Direction = "NORTH" | "SOUTH" | "EAST" | "WEST";
export type ResourceType = "COAL" | "IRON" | "GEM" | "GOLD" | "PLATIN";
export type PlanetNeighbour = {
  direction?: Direction;
  id: string;
};
export type ResourceDefinition = {
  resourceType: ResourceType;
  maxAmount: number;
  currentAmount: nunmber;
};

export type Planet = {
  planet: string;
  movementDifficulty: number;
  neighbours: PlanetNeighbour[];
  resource: ResourceDefinition | null | undefined;
};

export type PlanetDiscovered = Planet;

export type CommandFunction = () => Promise<void>;
export type SpottedRobot = {
  id: string;
  alive: boolean;
  levels: RobotLevels;
  playerNotion: string;
  movePath: string[];
};
