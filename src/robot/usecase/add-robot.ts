import { PlanetDependencies } from "../../common/dependencies/planet-dependency.js";
import { RobotDependencies } from "../../common/dependencies/robot-dependency.js";
import makeSavePlanetForRobot from "../../planet/usecase/save-planet-robot.js";
import Robot from "../entity/robot.js";

export default function makeaddRobot(
  { robotRepo }: RobotDependencies,
  { planetRepo }: PlanetDependencies
) {
  return async (robot: Robot) => {
    const savePlanetForRobot = makeSavePlanetForRobot({ planetRepo });
    await savePlanetForRobot(robot.id, robot.planet.planetId);
    robot.robotLevels = {
      damageLevel: 0,
      energyLevel: 0,
      energyRegenLevel: 0,
      healthLevel: 0,
      miningLevel: 0,
      miningSpeedLevel: 0,
      storageLevel: 0,
    };
    const robots = await robotRepo.saveRobot(robot);
    return robots;
  };
}
