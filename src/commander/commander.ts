// The Commander has access to every state and is responsible of
// deciding on round/game strategies
// The commander will be notified about events and updates the
// strategy according to it.
// We really want to decouple the various strategies from our
// state implementation to keep it really portable.

import { attack, buyRobots, moveTo, regenerate } from "../commands.js";
import { CommandFunction, CommanderNotification } from "../types";

import { FleetedRobot } from "../state/fleet.js";
import { bank, fleet, map, price, radar } from "../state/state.js";

const MAX_FLEET_SIZE = 30;
const DEFAULT_ROBOT_BUY_BATCH_SIZE = 5;
const REGENERATE_THRESHOLD = 5;

const IDLE_ACTION = (robot: FleetedRobot): CommandFunction => {
  const path = map.shortestPathToUnknownPlanet(robot.planet);
  if (path && path.length > 1) {
    return () => moveTo(robot, path[1]);
  }
  return () => regenerate(robot);
};

function calculateRobotBuyAmount(): number {
  const robotPrice = price.get("ROBOT") || Number.MAX_VALUE;
  const balance = bank.get();
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
  const enemyRobotsInReach = (id: FleetedRobot) => radar.getOnPlanet(id.planet);

  for (const robot of fleet.getAll()) {
    const id = robot.id;
    const spottedRobots = enemyRobotsInReach(robot);

    switch (true) {
      case spottedRobots.length > 0:
        robotCmd[id] = () => attack(robot, spottedRobots[0]);
        break;
      case robot.energy < REGENERATE_THRESHOLD:
        robotCmd[id] = () => regenerate(robot);
        break;
      default:
        robotCmd[id] = IDLE_ACTION(robot);
    }
  }

  return Object.values(robotCmd);
}

export function fetchCommands(): CommandFunction[] {
  return [...globalCommands(), ...robotCommands()];
}

export function notify(notification: CommanderNotification) {
  return;
}
