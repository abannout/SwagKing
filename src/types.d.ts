export type ReqCreatePlayer = {
  name: string;
  email: string;
};

export type ResCreatePlayer = {
  playerId: string;
  name: string;
  email: string;
};

export type GameStatus = "created" | "started" | "ended";
export type RoundStatus = "started" | "command input ended" | "ended";
export type CommandType =
  | "mining"
  | "movement"
  | "battle"
  | "buying"
  | "selling"
  | "regenerate";

export type ResGetGame = {
  gameId: string;
  gameStatus: GameStatus;
  participatingPlayers: string[];
};

export type ResRegisterGame = {
  gameExchange: string;
  playerQueue: string;
};

export type ReqCreateGame = {
  maxRounds: number;
  maxPlayers: number;
};

export type ResCreateGame = {
  gameId: string;
};

export type ReqUpdateMaxRounds = {
  maxRounds: number;
};

export type ReqUpdateRoundDuration = {
  duration: number;
};

export type EventHeaders = {
  eventId: string;
  type: string;
  timestamp: string;
};

export type EventRoundStatusPayload = {
  gameId: string;
  roundStatus: RoundStatus;
};

type Robot = {
  id: string;
  alive: boolean;
  player: string;
  maxHealth: number;
  maxEnergy: number;
  energyRegen: number;
  attackDamage: number;
  miningSpeed: number;
  health: number;
  energy: number;
  healthLevel: number;
  damageLevel: number;
  miningSpeedLevel: number;
  miningLevel: number;
  energyLevel: number;
  energyRegenLevel: number;
  storageLevel: number;
};

export type EventRobotSpawned = {
  robot: Robot;
};

type BaseCommand<T extends BaseCommandObject> = {
  gameId: string;
  playerId: string;
  robotId: string | null;
  commandType: CommandType;
  commandObject: T;
};

type BaseCommandObject = {
  commandType: CommandType;
  planetId: string | null;
  targetId: string | null;
  itemName: string | null;
  itemQuantity: number | null;
};

export type BuyRobotCommandObject = Pick<BaseCommandObject, "commandType"> & {
  itemName: "robot";
  itemQuantity: number;
};

export type BuyRobotCommand = Omit<
  BaseCommand<BuyRobotCommandObject>,
  "robotId"
> & {
  commandType: "buying";
};

export type GameCommand = BuyRobotCommand;
