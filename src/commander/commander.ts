// The Commander has access to every state and is responsible of
// deciding on round/game strategies
// The commander will be notified about events and updates the
// strategy according to it.
// We really want to decouple the various strategies from our
// state implementation to keep it really portable.

import { buyRobots, moveTo, regenerate } from "../commands.js";
import { CommandFunction, CommanderNotification } from "../types";

import { FleetedRobot } from "../state/fleet.js";
import { bank, fleet, map, price } from "../state/state.js";
import { StrategyType, strategies } from "./strategies/strategies.js";

const MAX_FLEET_SIZE = 30;
const DEFAULT_ROBOT_BUY_BATCH_SIZE = 5;

const strategyDistribution: Record<StrategyType, number> = {
  FARMING: 0.8,
  FIGHTING: 0,
  EXPLORING: 0.2,
};

const strategyAssignment: Record<string, StrategyType> = {};

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

function validateStrategyDistribution() {
  const sum = Object.values(strategyDistribution).reduce(
    (acc, val) => acc + val,
    0
  );
  if (sum !== 1) {
    throw new Error("Strategy distribution does not sum to 1");
  }
}

function getCurrentStratgeyDistribution(): Record<StrategyType, number> {
  const currentDistribution: Record<StrategyType, number> = {
    FARMING: 0,
    FIGHTING: 0,
    EXPLORING: 0,
  };
  const fleetSize = fleet.size();
  if (fleetSize <= 0) return currentDistribution;

  for (const robot of fleet.getAll()) {
    const strategy = strategyAssignment[robot.id];
    currentDistribution[strategy]++;
  }

  for (const strategy of Object.keys(currentDistribution)) {
    currentDistribution[strategy as StrategyType] /= fleetSize;
  }

  return currentDistribution;
}

function getStrategyForRobot(robot: FleetedRobot): StrategyType {
  validateStrategyDistribution();

  if (!strategyAssignment[robot.id]) {
    const currentDistribution = getCurrentStratgeyDistribution();
    const targetDistribution = strategyDistribution;

    for (const [key, value] of Object.entries(targetDistribution)) {
      if (currentDistribution[key as StrategyType] < value) {
        strategyAssignment[robot.id] = key as StrategyType;
        return key as StrategyType;
      }
    }
  }
  return strategyAssignment[robot.id];
}

function robotCommands(): CommandFunction[] {
  const robotCmd: Record<string, CommandFunction> = {};

  for (const robot of fleet.getAll()) {
    const id = robot.id;
    const strategyType = getStrategyForRobot(robot);
    const strategy = strategies[strategyType];
    robotCmd[id] = strategy.nextMove(robot) || IDLE_ACTION(robot);
  }

  return Object.values(robotCmd);
}

export function fetchCommands(): CommandFunction[] {
  return [...globalCommands(), ...robotCommands()];
}

export function notify(notification: CommanderNotification) {
  return;
}
