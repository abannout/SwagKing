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

const strategyDistribution: Record<StrategyType, number> = {
  FARMING: 0.8,
  FIGHTING: 0,
  EXPLORING: 0.2,
};

const strategyAssignment: Record<string, StrategyType> = {};

export const strategies: Record<StrategyType, Strategey> = {
  FARMING: farming,
  FIGHTING: fighting,
  EXPLORING: exploring,
};

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

export function getStrategyForRobot(robot: FleetedRobot): Strategey {
  validateStrategyDistribution();
  const assignment = strategyAssignment[robot.id];

  if (!assignment) {
    const currentDistribution = getCurrentStratgeyDistribution();
    const targetDistribution = strategyDistribution;

    for (const [key, value] of Object.entries(targetDistribution)) {
      if (currentDistribution[key as StrategyType] < value) {
        strategyAssignment[robot.id] = key as StrategyType;
        strategies[key as StrategyType];
      }
    }
  }
  return strategies[assignment];
}
