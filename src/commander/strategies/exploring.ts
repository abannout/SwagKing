import { buyItem, moveTo, regenerate } from "../../commands.js";
import { FleetedRobot } from "../../state/fleet.js";
import { bank, map, price } from "../../state/state.js";
import { CommandFunction, Tradable } from "../../types.js";
import { getUpgrade } from "../../utils/utils.js";

const MAX_UPGRADE_LEVEL = 3;

function nextUpgrade(robot: FleetedRobot): Tradable | null {
  const { energyLevel, energyRegenLevel } = robot;
  const min = Math.min(energyLevel, energyRegenLevel);

  if (energyLevel < MAX_UPGRADE_LEVEL && energyLevel === min) {
    return getUpgrade("MAX_ENERGY", energyLevel);
  }

  if (energyRegenLevel < MAX_UPGRADE_LEVEL && energyRegenLevel === min) {
    return getUpgrade("ENERGY_REGEN", energyRegenLevel);
  }

  return null;
}

export function nextMove(robot: FleetedRobot): CommandFunction | undefined {
  const upgrade = nextUpgrade(robot);
  if (upgrade) {
    const upgradePrice = price.get(upgrade);
    if (upgradePrice && bank.checkReserved(upgradePrice)) {
      return () => buyItem(robot.id, upgrade);
    }
  }

  const planet = map.getPlanet(robot.planet);
  if (planet && planet.movementDifficulty + 1 > robot.energy) {
    return () => regenerate(robot);
  }

  const path = map.shortestPathToUnknownPlanet(robot.planet);
  if (path && path.length > 1) {
    return () => moveTo(robot, path[1]);
  }

  return undefined;
}
