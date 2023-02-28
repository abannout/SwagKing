// The Commander has access to every state and is responsible of
// deciding on round/game strategies
// The commander will be notified about events and updates the
// strategy according to it.
// We really want to decouple the various strategies from our
// state implementation to keep it really portable.

import { buyRobots, moveTo, regenerate } from "../commands.js";
import { CommandFunction } from "../types";

import { FleetedRobot } from "../state/fleet.js";
import { bank, fleet, map, price } from "../state/state.js";
import * as strategies from "./strategies/strategies.js";

const MAX_FLEET_SIZE = 30;
const DEFAULT_ROBOT_BUY_BATCH_SIZE = 5;

export const IDLE_ACTION = (robot: FleetedRobot): CommandFunction => {
  const path = map.shortestPathToUnknownPlanet(robot.planet);
  if (path && path.length > 1) {
    return () => moveTo(robot, path[1]);
  }
  return () => regenerate(robot);
};

function calculateRobotBuyAmount(): number {
  const robotPrice = price.get("ROBOT") || Number.MAX_VALUE;
  const balance = bank.getAvailable();
  const maxBuyableAmount = Math.floor(balance / robotPrice);

  return Math.min(DEFAULT_ROBOT_BUY_BATCH_SIZE, maxBuyableAmount);
}

function globalCommands(): CommandFunction[] {
  const arr = [];
  const fleetSize = fleet.size();
  const shouldBuyRobots = fleetSize < MAX_FLEET_SIZE;
  if (shouldBuyRobots) {
    const buyAmount = calculateRobotBuyAmount();
    if (buyAmount > 0) {
      arr.push(() => buyRobots(buyAmount));
    }
  }
  return arr;
}

function robotCommands(): CommandFunction[] {
  const robotCmd: Record<string, CommandFunction> = {};

  for (const robot of fleet.getAll(true)) {
    const id = robot.id;
    const strategy = strategies.getStrategyForRobot(robot);
    robotCmd[id] = strategy.nextMove(robot) || IDLE_ACTION(robot);
  }

  return Object.values(robotCmd);
}

export function fetchCommands(): CommandFunction[] {
  return [...globalCommands(), ...robotCommands()];
}
