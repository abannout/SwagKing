import { RobotSpawned } from "../../common/types"
import RobotInventory from "./robotInventory"
import RobotLevels from "./robotLevels"
import RobotPlanet from "./robotPlanet"

export default interface Robot {
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

export function makeRobot(robot: RobotSpawned): Robot {
  return {
    id: robot.robot.id,
    alive: robot.robot.alive,
    player: robot.robot.player,
    planet: {
      planetId: robot.robot.player,
      resourceType: robot.robot.planet.resourceType,
    },
    maxHealth: robot.robot.maxHealth,
    maxEnergy: robot.robot.maxEnergy,
    energyRegen: robot.robot.energyRegen,
    attackDamage: robot.robot.attackDamage,
    miningSpeed: robot.robot.miningSpeed,
    health: robot.robot.health,
    energy: robot.robot.energy,
    inventory: robot.robot.inventory,
    robotLevels: robot.robot.robotLevels,
  }
}
