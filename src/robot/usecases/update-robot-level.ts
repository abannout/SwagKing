import { RobotDependencies } from "../../common/dependencies/robot-dependency.js";
import * as relay from "../../common/net/relay.js";
import logger from "../../utils/logger.js";
import makegetRobot from "../service/get-robot.js";
import makeUpdateRobot from "../service/update-robot.js";

export function handleUpdateRobotLevel({ robotRepo }: RobotDependencies) {
  return async () => {
    relay.on("RobotUpgraded", async (event, context) => {
      const { payload } = event;
      logger.info(
        `Robot with id: ${payload.robotId} has been updated ${payload.upgrade} to level ${payload.level}`
      );
      try {
        const updateRobot = makeUpdateRobot({ robotRepo });
        const getRobot = makegetRobot({ robotRepo });
        const robot = await getRobot(payload.robotId);
        robot.robotLevels.damageLevel = payload.level;
        await updateRobot(robot);
      } catch (e) {
        logger.error((e as Error).message);
        logger.error("could not update the level of a robot!!");
      }
    });
  };
}
