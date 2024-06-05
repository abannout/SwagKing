import { PlanetDependencies } from "../../common/dependencies/planet-dependency.js";
import { RobotDependencies } from "../../common/dependencies/robot-dependency.js";
import makeSavePlanetForRobot from "../../planet/service/save-planet-robot.js";
import Robot from "../entity/robot";

export default function makeaddRobot(
  { robotRepo }: RobotDependencies,
  { planetRepo }: PlanetDependencies
) {
  return async (robot: Robot) => {
    const savePlanetForRobot = makeSavePlanetForRobot({ planetRepo });
    await savePlanetForRobot(robot.id, robot.planet.planetId);
    const robots = await robotRepo.saveRobot(robot);
    return robots;
  };
}
