import { FleetedRobot } from "../../state/fleet.js";
import { fleet } from "../../state/state.js";
import { CommandFunction } from "../../types.js";

import * as exploring from "./exploring.js";
import * as farming from "./farming.js";
import * as fighting from "./fighting.js";

export type StrategyType = "FARMING" | "FIGHTING" | "EXPLORING";
export type StrategyFunction = (
  robot: FleetedRobot
) => CommandFunction | undefined;
export type Strategey = {
  nextMove: StrategyFunction;
};

const DEFAULT_STRAGEY: StrategyType = "FARMING";
const _strategyDistribution: Record<StrategyType, number> = {
  FARMING: 60,
  FIGHTING: 30,
  EXPLORING: 10,
};

const strategyAssignment: Record<string, StrategyType> = {};

const strategies: Record<StrategyType, Strategey> = {
  FARMING: farming,
  FIGHTING: fighting,
  EXPLORING: exploring,
};

function getStrategyAssignmentAsArray(): Record<StrategyType, string[]> {
  const assignment: Record<StrategyType, string[]> = {
    FARMING: [],
    FIGHTING: [],
    EXPLORING: [],
  };

  for (const [key, value] of Object.entries(strategyAssignment)) {
    assignment[value].push(key);
  }

  return assignment;
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

  return currentDistribution;
}

function getTargetStrategyDistribution(): Record<StrategyType, number> {
  const targetDistribution: Record<StrategyType, number> = {
    FARMING: 0,
    FIGHTING: 0,
    EXPLORING: 0,
  };
  const fleetSize = fleet.size();
  if (fleetSize <= 0) return targetDistribution;

  const sum = Object.values(_strategyDistribution).reduce(
    (acc, val) => acc + val,
    0
  );

  for (const strategy of Object.keys(targetDistribution)) {
    targetDistribution[strategy as StrategyType] = Math.round(
      (_strategyDistribution[strategy as StrategyType] / sum) * fleetSize
    );
  }

  return targetDistribution;
}

function strategicValue(robot: FleetedRobot): number {
  const {
    damageLevel,
    energyLevel,
    energyRegenLevel,
    healthLevel,
    miningLevel,
    miningSpeedLevel,
    storageLevel,
  } = robot;
  return (
    damageLevel +
    energyLevel +
    energyRegenLevel +
    healthLevel +
    miningLevel +
    miningSpeedLevel +
    storageLevel
  );
}

export function getStrategyForRobot(robot: FleetedRobot): Strategey {
  const assignment = strategyAssignment[robot.id];

  if (!assignment) {
    const currentDistribution = getCurrentStratgeyDistribution();
    const targetDistribution = getTargetStrategyDistribution();

    for (const [key, value] of Object.entries(targetDistribution)) {
      if (currentDistribution[key as StrategyType] < value) {
        strategyAssignment[robot.id] = key as StrategyType;
        return strategies[key as StrategyType];
      }
    }

    strategyAssignment[robot.id] = DEFAULT_STRAGEY;
    return strategies[DEFAULT_STRAGEY];
  }
  return strategies[assignment];
}

export function reconcileStrategyDistribution() {
  const targetDistribution = getTargetStrategyDistribution();
  const currentDistribution = getCurrentStratgeyDistribution();
  const strategyAssignments = getStrategyAssignmentAsArray();
  const robots = fleet.getAll(true);

  let lastSlice = 0;
  for (const [key, value] of Object.entries(targetDistribution)) {
    const robotsInStrategy = strategyAssignments[key as StrategyType];
    robotsInStrategy.sort((a, b) => {
      const robotA = fleet.get(a);
      const robotB = fleet.get(b);
      if (!robotA || !robotB) throw new Error("Robot not found");
      return strategicValue(robotA) - strategicValue(robotB);
    });
    const robotsInOtherStrategies = robots.filter(
      (r) => !robotsInStrategy.includes(r.id)
    );
    robotsInOtherStrategies.sort(
      (a, b) => strategicValue(a) - strategicValue(b)
    );

    const slice = value - currentDistribution[key as StrategyType];
    if (currentDistribution[key as StrategyType] < value) {
      const robots = robotsInOtherStrategies.splice(lastSlice, slice);
      for (const robot of robots) {
        strategyAssignment[robot.id] = key as StrategyType;
      }
    } else {
      const robots = robotsInStrategy.splice(
        lastSlice,
        value - currentDistribution[key as StrategyType]
      );
      for (const robot of robots) {
        strategyAssignment[robot] = key as StrategyType;
      }
    }
    lastSlice = slice;
  }
}

export function getStrategies() {
  return {
    target: getTargetStrategyDistribution(),
    current: getCurrentStratgeyDistribution(),
  };
}
