import { Robot } from "./types";

const fleet: Robot[] = [];

function add(robot: Robot): void {
  fleet.push(robot);
}

function get(id: string): Robot | undefined {
  return fleet.find((robot) => robot.id === id);
}

function remove(id: string): void {
  const index = fleet.findIndex((robot) => robot.id === id);
  fleet.splice(index, 1);
}

function clear(): void {
  fleet.splice(0, fleet.length);
}

function first(): Robot | undefined {
  return fleet[0];
}

function size(): number {
  return fleet.length;
}

export default {
  add,
  get,
  remove,
  first,
  size,
};
