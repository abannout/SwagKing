import logger from "../../utils/logger.js";
import * as relay from "../../common/net/relay.js";
import { mineResources } from "./command/mine-robot.js";
import { makeMineResource } from "../service/mine-resource.js";
import { RobotDependencies } from "../../common/dependencies/robot-dependency.js";

export function makeRobotMineResource({ robotRepo }: RobotDependencies) {
  return async () => {
    relay.on("RobotResourceMined", async (event, context) => {
      const { payload } = event;

      const mineResource = makeMineResource({ robotRepo });
      const list = await mineResource();
      if (!list || list.length <= 0) return;
      list.forEach((robot) => {
        mineResources(robot.id);
        logger.info(`mining robot with id: ${robot.id}`);
      });
    });
  };
}
