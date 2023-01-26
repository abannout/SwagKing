import { ResourceInventory, Robot } from "../types";

export type FleetedRobot = Robot & {
  inventory: ResourceInventory;
};

const fleet: Record<string, FleetedRobot> = {};

function add(robot: Robot): void {
  fleet[robot.id] = {
    ...robot,
    inventory: {
      COAL: 0,
      GEM: 0,
      GOLD: 0,
      IRON: 0,
      PLATIN: 0,
    },
  };
}

function set(robot: FleetedRobot): void {
  fleet[robot.id] = robot;
}

function get(id: string): FleetedRobot | undefined {
  return fleet[id];
}

function remove(id: string): void {
  delete fleet[id];
}

function clear(): void {
  for (const prop of Object.getOwnPropertyNames(fleet)) {
    delete fleet[prop];
  }
}

function first(): FleetedRobot | undefined {
  return fleet[0];
}

function size(): number {
  return Object.keys(fleet).length;
}

export default {
  add,
  set,
  get,
  remove,
  first,
  size,
  clear,
};
