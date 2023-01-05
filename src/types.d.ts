// -------------------------------
// Utils
// -------------------------------
export type Awaitable<T> = T | PromiseLike<T>


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

export type RobotIntegrationEventType =
  | "RobotAttackedIntegrationEvent"
  | "RobotMovedIntegrationEvent"
  | "RobotRegeneratedIntegrationEvent"
  | "RobotResourceMinedIntegrationEvent"
  | "RobotResourceRemovedIntegrationEvent"
  | "RobotRestoredAttributesIntegrationEvent"
  | "RobotSpawnedIntegrationEvent"
  | "RobotUpgradedIntegrationEvent";

export type RobotEventType = "RobotSpawned" | "RobotInventoryUpdated" | "RobotMoved";

export type GameEventType = "round-status" | "status";

export type ErrorEventType = "error";

export type MapEventType = "planet-discovered";

export type TradingEventType = "BankAccountTransactionBooked"
  | "BankAccountTransactionBooked"
  | "BankAccountInitialized"
  | "TradableBought"
  | "TradableSold"
  | "TradablePrices";

// export type EventType = RobotEventType | RobotIntegrationEventType | GameEventType | MapEventType | ErrorEventType | TradingEventType;
export type EventType = keyof ClientEvents; // TODO: I really want to use the union type above as EventType and reflect it into ClientEvents

export type EventHeaders = {
  eventId: string;
  type: EventType;
  timestamp: string;
  "kafka-topic": string;
};

export type GameEvent<T> = {
  headers: EventHeaders,
  payload: T
};

export interface ClientEvents {
  "planet-discovered": PlanetDiscovered;
  "RobotMoved": EventRobotMoved;
  "RobotInventoryUpdated": RobotInventoryUpdated;
  "RobotSpawned": EventRobotSpawned;
  "game-status": EventGameStatusPayload;
  "round-status": EventRoundStatusPayload;
  "error": any;
  "RobotAttackedIntegrationEvent": RobotAttackedIntegrationEvent;
  "RobotMovedIntegrationEvent": RobotMovedIntegrationEvent;
  "RobotRegeneratedIntegrationEvent": RobotRegeneratedIntegrationEvent;
  "RobotResourceMinedIntegrationEvent": RobotResourceMinedIntegrationEvent;
  "RobotResourceRemovedIntegrationEvent": RobotResourceRemovedIntegrationEvent;
  "RobotRestoredAttributesIntegrationEvent": RobotRestoredAttributesIntegrationEvent;
  "RobotSpawnedIntegrationEvent": RobotSpawnedIntegrationEvent;
  "RobotUpgradedIntegrationEvent": RobotUpgradedIntegrationEvent;
};

export type GameEventMapping = Record<EventHeaders, GameEvent<infer T>>;

export type EventRoundStatusPayload = {
  gameId: string;
  roundNumber: number;
  roundStatus: RoundStatus;
};

export type EventGameStatusPayload = {
  gameId: string;
  status: GameStatus;
};

export type RobotPlanet = {
  planetId: string;
  resourceType: string;
};

export type Robot = {
  id: string;
  alive: boolean;
  player: string;
  planet: RobotPlanet;
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

export type EventRobotMoved = {
  robot: string;
  fromPlanet: string;
  toPlanet: string;
};

export type RobotInventoryUpdated = {
  robot: string;
  inventory: {
    resources: ResourceInventory;
  };
};

export type RobotAttackedIntegrationEvent = {
  attacker: RobotAttack;
  target: RobotAttack;
};

type RobotAttack = {
  robotId: string;
  availableHealth: number;
  availableEnergy: number;
  alive: boolean;
};

export type RobotMovedIntegrationEvent = {
  robotId: string;
  remainingEnergy: number;
  fromPlanet: Movement;
  toPlanet: Movement;
};

type Movement = {
  id: string;
  movementDifficulty: number;
};

export type RobotRegeneratedIntegrationEvent = {
  robotId: string;
  availableEnergy: number;
};

export type RobotResourceMinedIntegrationEvent = {
  robotId: string;
  minedAmount: number;
  minedResource: Resource;
  resourceInventory: ResourceInventory;
};

export type RobotResourceRemovedIntegrationEvent = {
  robotId: string;
  removedAmount: number;
  removedResource: Resource;
  resourceInventory: ResourceInventory;
};

export type RobotRestoredAttributesIntegrationEvent = {
  restorationType: RestorationType;
  robotId: string;
  availableEnergy: number;
  availableHealth: number;
};

export type RobotSpawnedIntegrationEvent = {
  robot: Robot;
};

export type RobotUpgradedIntegrationEvent = {
  robotId: string;
  level: number;
  upgrade: UpgradeType;
};

export type UpgradeType =
  | "STORAGE"
  | "HEALTH"
  | "DAMAGE"
  | "MINING_SPEED"
  | "MINING"
  | "MAX_ENERGY"
  | "ENERGY_REGEN";
export type RestorationType = "HEALTH" | "ENERGY";
export type ResourceInventory = Record<Resource, number>;

export type Resource =
  | "coal"
  | "iron"
  | "gem"
  | "gold"
  | "platin";
// -------------------------------
// Commands
// -------------------------------

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

export type SellCommandObject = Pick<BaseCommandObject, "commandType"> & {};

export type SellCommand = Pick<
  BaseCommand<SellCommandObject>,
  "robotId" | "commandType" | "commandObject"
> & {
  commandType: "selling";
};

export type MineCommandObject = Pick<BaseCommandObject, "commandType"> & {};

export type MineCommand = Pick<
  BaseCommand<MineCommandObject>,
  "commandType" | "robotId" | "commandObject"
> & {
  commandType: "mining";
};

export type MoveCommandObject = Pick<
  BaseCommandObject,
  "commandType" | "planetId"
>;

export type MoveCommand = Pick<
  BaseCommand<MoveCommandObject>,
  "commandType" | "robotId" | "commandObject"
> & {
  commandType: "movement";
};

export type GameCommand = BuyRobotCommand | GameCommand;

export type Direction = "north" | "south" | "east" | "west";
export type Resource = "coal" | "iron" | "gem" | "gold" | "platin";
export type PlanetNeighbour = {
  direction: Direction;
  id: string;
};
export type ResourceDefinition = {
  resource_type: Resource;
  max_amount: number;
  current_amount: nunmber;
};

export type Planet = {
  planet: string;
  movement_difficulty: number;
  neighbours: PlanetNeighbour[];
  resource: ResourceDefinition | null | undefined;
};

export type PlanetDiscovered = Planet;