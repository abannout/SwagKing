import { FleetedRobot } from "../../state/fleet.js";
import { CommandFunction } from "../../types.js";

import * as exploring from "./exploringStrategy.js";
import * as farming from "./farmingStrategy.js";
import * as fighting from "./fightingStrategy.js";

export type StrategyType = "FARMING" | "FIGHTING" | "EXPLORING";
export type StrategyFunction = (
  robot: FleetedRobot
) => CommandFunction | undefined;
export type Strategey = {
  nextMove: StrategyFunction;
};

export const strategies: Record<StrategyType, Strategey> = {
  FARMING: farming,
  FIGHTING: fighting,
  EXPLORING: exploring,
};
