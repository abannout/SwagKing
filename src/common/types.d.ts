// -------------------------------
// Utils

import Robot from "../robot/entity/robot"

// -------------------------------
export type Awaitable<T> = T | PromiseLike<T>

// -------------------------------
// Game HTTP Definitions
// -------------------------------

export type ReqCreatePlayer = {
  name: string
  email: string
}

export type ReqCreateGame = {
  maxRounds: number
  maxPlayers: number
}

export type ReqUpdateMaxRounds = {
  maxRounds: number
}

export type ReqUpdateRoundDuration = {
  duration: number
}

export type ResCreatePlayer = {
  playerId: string
  name: string
  email: string
  playerExchange: string
}

export type ResGetGame = {
  gameId: string
  gameStatus: GameStatus
  participatingPlayers: string[]
}

export type ResCreateGame = {
  gameId: string
}

// -------------------------------
// Game Constants
// -------------------------------

export type GameStatus = "created" | "started" | "ended"
export type RoundStatus = "started" | "command input ended" | "ended"
export type CommandType =
  | "mining"
  | "movement"
  | "battle"
  | "buying"
  | "selling"
  | "regenerate"

export type GameRegistration = {
  gameId: string
  playerId: string
  playerExchange: string
}

// -------------------------------
// Eventing
// -------------------------------
export type ErrorEventType = "error"

export type EventType = keyof ClientEvents // TODO: I really want to use the union type above as EventType and reflect it into ClientEvents

export type EventHeaders = {
  eventId: string
  type: EventType
  timestamp: string
  "kafka-topic": string
}

export type GameEvent<T> = {
  headers: EventHeaders
  payload: T
}

export interface ClientEvents {
  PlanetDiscovered: PlanetDiscovered
  ResourceMined: ResourceMined
  RobotInventoryUpdated: RobotInventoryUpdated
  GameStatus: EventGameStatusPayload
  RoundStatus: EventRoundStatusPayload
  error: ErrorEvent
  RobotAttacked: RobotAttacked
  RobotMoved: RobotMoved
  RobotRegenerated: RobotRegenerated
  RobotResourceMined: RobotResourceMined
  RobotResourceRemoved: RobotResourceRemoved
  RobotRestoredAttributes: RobotRestoredAttributes
  RobotSpawned: RobotSpawned
  RobotUpgraded: RobotUpgraded
  BankAccountInitialized: BankAccountInitializedEvent
  BankAccountCleared: BankAccountClearedEvent
  BankAccountTransactionBooked: BankAccountTransactionBookedEvent
  TradablePrices: TradablePricesEvent
  TradableBought: TradableBoughtEvent
  TradableSold: TradableSoldEvent
  RobotsRevealed: RevealedRobotsEvent
}

export type ResourceMined = {
  planet: string
  minedAmount: number
  resource: ResourceDefinition
}

export type ErrorEvent = {
  playerId: string
  transactionId: string
  robotId: string
  description: string
  code: string
}

export type TradableType = "UPGRADE" | "RESOURCE"
export type UpgradeLevel = 1 | 2 | 3 | 4 | 5
export type Tradable = Uppercase<
  | ResourceType
  | `${UpgradeType}_${UpgradeLevel}`
  | "ROBOT"
  | `${RestorationType}_RESTORE`
>
export type TradablePrice = {
  type: TradableType
  price: number
  name: Tradable
}
export type TradablePricesEvent = Array<TradablePrice>

export type TradableSoldEvent = {
  playerId: string
  robotId: string
  type: TradableType
  name: Tradable
  amount: number
  pricePerUnit: number
  totalPrice: number
}

export type TradableBoughtEvent = TradableSoldEvent

export type BankAccountClearedEvent = {
  playerId: string
  balance: 0
}

export type BankAccountInitializedEvent = {
  playerId: string
  balance: number
}

export type BankAccountTransactionBookedEvent = {
  playerId: string
  transactionAmount: number
  balance: number
}

export type EventRoundStatusPayload = {
  gameId: string
  roundNumber: number
  roundId: string
  roundStatus: RoundStatus
}

export type EventGameStatusPayload = {
  gameId: string
  status: GameStatus
}

export type RobotPlanet = {
  planetId: string
  resourceType: string
}

export type Robot = {
  id: string
  alive: boolean
  player: string
  planet: RobotPlanet
  maxHealth: number
  maxEnergy: number
  energyRegen: number
  attackDamage: number
  miningSpeed: number
  health: number
  energy: number
  inventory: RobotInventory
  robotLevels: RobotLevels
}

export type RobotLevels = {
  healthLevel: number
  damageLevel: number
  miningSpeedLevel: number
  miningLevel: number
  energyLevel: number
  energyRegenLevel: number
  storageLevel: number
}

export type RevealedRobotsEvent = {
  robots: RevealedRobot[]
}

export type RevealedRobot = {
  robotId: string
  health: number
  energy: number
  planetId: string
  playerNotion: string
  levels: RobotLevels
}

export type RobotInventoryUpdated = {
  robot: string
  inventory: RobotInventory
}

export type RobotInventory = {
  storageLevel: number
  resources: ResourceInventory
  maxStorage: number
  usedStorage: number
  full: boolean
}

export type RobotAttacked = {
  attacker: RobotAttack
  target: RobotAttack
}

type RobotAttack = {
  robotId: string
  availableHealth: number
  availableEnergy: number
  alive: boolean
}

export type RobotMoved = {
  robotId: string
  remainingEnergy: number
  fromPlanet: Movement
  toPlanet: Movement
}

type Movement = {
  id: string
  movementDifficulty: number
}

export type RobotRegenerated = {
  robotId: string
  availableEnergy: number
}

export type RobotResourceMined = {
  robotId: string
  minedAmount: number
  minedResource: Resource
  resourceInventory: ResourceInventory
}

export type RobotResourceRemoved = {
  robotId: string
  removedAmount: number
  removedResource: Resource
  resourceInventory: ResourceInventory
}

export type RobotRestoredAttributes = {
  restorationType: RestorationType
  robotId: string
  availableEnergy: number
  availableHealth: number
}

export type RobotSpawned = {
  robot: Robot
}

export type RobotUpgraded = {
  robotId: string
  level: number
  upgrade: UpgradeType
  robot: Robot
}

export type UpgradeType =
  | "STORAGE_1"
  | "HEALTH_1"
  | "DAMAGE_1"
  | "MINING_SPEED_1"
  | "MINING_1"
  | "MAX_ENERGY_1"
  | "ENERGY_REGEN_1"
  | "STORAGE_2"
  | "HEALTH_2"
  | "DAMAGE_2"
  | "MINING_SPEED_2"
  | "MINING_2"
  | "MAX_ENERGY_2"
  | "ENERGY_REGEN_2"
  | "STORAGE_3"
  | "HEALTH_3"
  | "DAMAGE_3"
  | "MINING_SPEED_3"
  | "MINING_3"
  | "MAX_ENERGY_3"
  | "ENERGY_REGEN_3"
  | "STORAGE_4"
  | "HEALTH_4"
  | "DAMAGE_4"
  | "MINING_SPEED_4"
  | "MINING_4"
  | "MAX_ENERGY_4"
  | "ENERGY_REGEN_4"
  | "STORAGE_5"
  | "HEALTH_5"
  | "DAMAGE_5"
  | "MINING_SPEED_5"
  | "MINING_5"
  | "MAX_ENERGY_5"
  | "ENERGY_REGEN_5"
export type RestorationType = "HEALTH" | "ENERGY"
export type ResourceInventory = Record<ResourceType, number>

// -------------------------------
// Commands
// -------------------------------
export type GameCommand = BuyRobotCommand | GameCommand

export type BaseCommand<K extends CommandType, T extends CommandData> = {
  playerId: string
  type: K
  data: T
}
type CommandData =
  | BattleCommandData
  | BuyTradableCommandData
  | MineCommandData
  | MoveCommandData
  | RegenerateCommandData
  | SellTradablesCommandData
type BattleCommandData = {
  robotId: string
  targetId: string
}
type BattleCommand = BaseCommand<"battle", BattleCommandData>
type BuyTradableCommandData = {
  robotId: string | null
  itemName: string
  itemQuantity: number
}
type BuyTradableCommand = BaseCommand<"buying", BuyTradableCommandData>
type BuyUpgradesCommandData = {
  robotId: string | null
  itemName: string
  planetId: string
  itemQuantity: number
}
type BuyUpgradesCommand = BaseCommand<"buying", BuyUpgradesCommandData>

type MineCommandData = {
  robotId: string
}
type MineCommand = BaseCommand<"mining", MineCommandData>
type MoveCommandData = {
  robotId: string
  planetId: string
}
type MoveCommand = BaseCommand<"movement", MoveCommandData>
type RegenerateCommandData = {
  robotId: string
}
type RegenerateCommand = BaseCommand<"regenerate", RegenerateCommandData>
type SellTradablesCommandData = {
  robotId: string
}
type SellTradablesCommand = BaseCommand<"selling", SellTradablesCommandData>

export type GameCommand =
  | BattleCommand
  | BuyTradableCommand
  | MineCommand
  | MoveCommand
  | RegenerateCommand
  | SellTradablesCommand
  | BuyUpgradesCommand

export type Direction = "NORTH" | "SOUTH" | "EAST" | "WEST"
export type ResourceType = "COAL" | "IRON" | "GEM" | "GOLD" | "PLATIN"
export type PlanetNeighbour = {
  direction?: Direction
  id: string
}
export type ResourceDefinition = {
  type: ResourceType
  maxAmount: number
  currentAmount: nunmber
}

export type Planet = {
  planet: string
  movementDifficulty: number
  neighbours: PlanetNeighbour[]
  resource: ResourceDefinition | null | undefined
}

export type PlanetDiscovered = Planet

export type CommandFunction = () => Promise<void>
export type SpottedRobot = {
  id: string
  alive: boolean
  levels: RobotLevels
  playerNotion: string
  movePath: string[]
}
