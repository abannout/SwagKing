import logger from "../../utils/logger.js";
import * as relay from "../../common/net/relay.js";
import makeaddRobot from "../service/add-robot.js";
import { RobotDependencies } from "../../common/dependencies/robot-dependency.js";
import { PlanetDependencies } from "../../common/dependencies/planet-dependency.js";

export function makeAddRobot(
  { robotRepo }: RobotDependencies,
  { planetRepo }: PlanetDependencies
) {
  return async () => {
    relay.on("RobotSpawned", async (event, context) => {
      const { payload } = event;
      logger.info(`Robot has been spawned with id: ${payload.robot.id}`);

      const addRobot = makeaddRobot({ robotRepo }, { planetRepo });
      const robotsNumber = await addRobot(payload.robot);
      logger.info(
        `Robot has been spawned with id: ${payload.robot.id}. you now have ${robotsNumber} Robots in the Map`
      );
    });
  };
}
