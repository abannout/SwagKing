import logger from "../../../utils/logger.js";
import * as relay from "../../../common/net/relay.js";
import robotService from "../../usecase/index.js";

export function handleAddRobot() {
  return async () => {
    relay.on("RobotSpawned", async (event, context) => {
      const { payload } = event;
      logger.info(`Robot has been spawned with id: ${payload.robot.id}`);

      const robotsNumber = robotService.addRobot(payload.robot);
      logger.info(
        `Robot has been spawned with id: ${payload.robot.id}. you now have ${robotsNumber} Robots in the Map`
      );
    });
  };
}
