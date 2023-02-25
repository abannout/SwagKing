import { buyItem, mine, moveTo, sell } from "../../commands.js";
import { FleetedRobot } from "../../state/fleet.js";
import { bank, map, price } from "../../state/state.js";
import { CommandFunction, ResourceType, Tradable } from "../../types";
import logger from "../../utils/logger.js";

const SELL_THRESHOLD = 0.8;
const MAX_UPGRADE_LEVEL = 3;

function mostValueableMinableResource(miningLevel: number): ResourceType {
  switch (miningLevel) {
    case 0:
      return "COAL";
    case 1:
      return "IRON";
    case 2:
      return "GEM";
    case 3:
      return "GOLD";
    case 4:
      return "PLATIN";
  }

  throw new Error("Invalid mining level");
}

function nextUpgrade(robot: FleetedRobot): Tradable | null {
  const { miningLevel, miningSpeedLevel, storageLevel } = robot;

  if (miningLevel < MAX_UPGRADE_LEVEL) {
    const newLevel = miningLevel + 1;
    return `MINING_${newLevel}` as Tradable;
  }

  if (miningSpeedLevel < MAX_UPGRADE_LEVEL) {
    const newLevel = miningSpeedLevel + 1;
    return `MINING_SPEED_${newLevel}` as Tradable;
  }

  if (storageLevel < MAX_UPGRADE_LEVEL) {
    const newLevel = storageLevel + 1;
    return `MINING_SPEED_${newLevel}` as Tradable;
  }

  return null;
}

export function nextMove(robot: FleetedRobot): CommandFunction | undefined {
  const sumInventory = Object.values(robot.inventory).reduce(
    (acc, curr) => acc + curr,
    0
  );
  if (sumInventory / robot.maxStorage >= SELL_THRESHOLD) {
    return () => sell(robot);
  }

  const upgrade = nextUpgrade(robot);
  if (upgrade) {
    const upgradePrice = price.get(upgrade);
    if (upgradePrice && bank.checkReserved(upgradePrice)) {
      return () => buyItem(robot.id, upgrade);
    }
  }

  const planet = map.getPlanet(robot.planet);
  if (!planet) {
    logger.warn(`Planet ${robot.planet} not found`);
    return undefined;
  }

  const availableResource = planet.resource;
  const mostValuableMinableResource = mostValueableMinableResource(
    robot.miningLevel
  );

  if (
    availableResource?.currentAmount > 0 &&
    availableResource?.resourceType === mostValuableMinableResource
  ) {
    return () => mine(robot);
  }

  const path = map.shortestPathToResource(
    robot.planet,
    mostValuableMinableResource
  );
  if (path && path.length > 1) {
    return () => moveTo(robot, path[1]);
  }

  return undefined;
}
