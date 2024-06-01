import { ResourceType } from "./resource";
import RobotInventory from "./robotInventory";
import RobotLevels from "./robotLevels";
import RobotPlanet from "./robotPlanet";

export default interface Robot {
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
  inventory: RobotInventory;
  robotLevels: RobotLevels;
}
