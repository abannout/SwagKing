import { ResourceInventory, Robot } from "../types";

type FleetedRobot = Robot & {
  inventory: ResourceInventory;
};

const fleet: Record<string, FleetedRobot> = {};

function add(robot: Robot): void {
  fleet[robot.id] = {
    ...robot,
    inventory: {
      coal: 0,
      gem: 0,
      gold: 0,
      iron: 0,
      platin: 0,
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
