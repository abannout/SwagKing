import { ResourceInventory, Robot } from "../types";

export type FleetedRobot = Omit<Robot, "planet" | "inventory"> & {
  planet: string;
  inventory: ResourceInventory;
  maxStorage: number;
};

const fleet: Record<string, FleetedRobot> = {};

export function getAll(): FleetedRobot[] {
  return Object.values(fleet);
}

export function add(robot: Robot): void {
  fleet[robot.id] = {
    ...robot,
    planet: robot.planet.planetId,
    inventory: {
      COAL: 0,
      GEM: 0,
      GOLD: 0,
      IRON: 0,
      PLATIN: 0,
    },
    maxStorage: robot.inventory.maxStorage,
  };
}

export function set(robot: FleetedRobot): void {
  fleet[robot.id] = robot;
}

export function get(id: string): FleetedRobot | undefined {
  return fleet[id];
}

export function getRobotsOnPlanet(id: string): FleetedRobot[] {
  return Object.values(fleet).filter((r) => r.planet === id);
}

export function remove(id: string): void {
  delete fleet[id];
}

export function clear(): void {
  for (const prop of Object.getOwnPropertyNames(fleet)) {
    delete fleet[prop];
  }
}

export function first(): FleetedRobot | undefined {
  return fleet[0];
}

export function size(): number {
  return Object.keys(fleet).length;
}
