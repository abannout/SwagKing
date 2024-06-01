import logger from "../../utils/logger.js";
import RobotRepository from "../repo/robotRepo.js";
import * as relay from "../../common/net/relay.js";
import makeaddRobot from "../service/add-robot.js";

interface Dependencies {
  robotRepo: RobotRepository;
}

export function makeAddRobot({ robotRepo }: Dependencies) {
  return async () => {
    relay.on("RobotSpawned", async (event, context) => {
      const { payload } = event;
      logger.info(`Robot has been spawned with id: ${payload.robot.id}`);

      const addRobot = makeaddRobot({ robotRepo });
      const robotsNumber = await addRobot(payload.robot);
      logger.info(
        `Robot has been spawned with id: ${payload.robot.id}. you now have ${robotsNumber} Robots in the Map`
      );
    });
  };
}
