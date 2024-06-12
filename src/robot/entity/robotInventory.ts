import { ResourceInventory } from "./resource"

export default interface RobotInventory {
  storageLevel: number
  resources: ResourceInventory
  maxStorage: number
  usedStorage: number
  full: boolean
}
