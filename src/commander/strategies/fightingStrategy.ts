import { attack, buyItem, moveTo, regenerate } from "../../commands.js";
import { FleetedRobot } from "../../state/fleet.js";
import { bank, map, price, radar } from "../../state/state.js";
import { CommandFunction, Tradable } from "../../types.js";
import { getUpgrade } from "../../utils/utils.js";

const MAX_UPGRADE_LEVEL = 3;

function nextUpgrade(robot: FleetedRobot): Tradable | null {
  const { damageLevel, healthLevel, energyLevel, energyRegenLevel } = robot;

  if (damageLevel < MAX_UPGRADE_LEVEL) {
    return getUpgrade("DAMAGE", damageLevel);
  }

  if (healthLevel < MAX_UPGRADE_LEVEL) {
    return getUpgrade("HEALTH", damageLevel);
  }

  if (energyLevel < MAX_UPGRADE_LEVEL) {
    return getUpgrade("MAX_ENERGY", damageLevel);
  }

  if (energyRegenLevel < MAX_UPGRADE_LEVEL) {
    return getUpgrade("ENERGY_REGEN", damageLevel);
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

  if (robot.damageLevel + 1 > robot.energy) {
    const regenPrice = price.get("ENERGY_RESTORE");
    if (regenPrice && bank.checkReserved(regenPrice)) {
      return () => buyItem(robot.id, "ENERGY_RESTORE");
    }
    return () => regenerate(robot);
  }

  const enemyRobotsInReach = (id: FleetedRobot) => radar.getOnPlanet(id.planet);
  const enemyRobots = enemyRobotsInReach(robot);
  if (enemyRobots.length > 0) {
    const target = enemyRobots[0];
    return () => attack(robot, target);
  }

  const path = map.shortestPath(
    robot.planet,
    (planet) => radar.getOnPlanet(planet).length > 0
  );
  if (path && path.length > 1) {
    return () => moveTo(robot, path[1]);
  }

  return undefined;
}
