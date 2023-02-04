import { ResourceInventory, Robot } from "../types";

export type FleetedRobot = Robot & {
  inventory: ResourceInventory;
  movePath: string[];
};

const fleet: Record<string, FleetedRobot> = {};

export function add(robot: Robot): void {
  fleet[robot.id] = {
    ...robot,
    inventory: {
      COAL: 0,
      GEM: 0,
      GOLD: 0,
      IRON: 0,
      PLATIN: 0,
    },
    movePath: [],
  };
}

export function set(robot: FleetedRobot): void {
  fleet[robot.id] = robot;
}

export function get(id: string): FleetedRobot | undefined {
  return fleet[id];
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
