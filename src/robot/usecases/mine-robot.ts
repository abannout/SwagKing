import logger from "../../utils/logger.js";
import * as relay from "../../common/net/relay.js";
import { mineResources } from "./command/mine-robot.js";
import {
  makeMineResource,
  makeUpdateInventory,
} from "../service/mine-resource.js";
import { RobotDependencies } from "../../common/dependencies/robot-dependency.js";

//toDo: map the dtos to robotinventory
export function makeRobotMineResource({ robotRepo }: RobotDependencies) {
  return async () => {
    relay.on("RoundStatus", async (event, context) => {
      const { payload } = event;

      if (
        payload.roundStatus === "command input ended" ||
        payload.roundStatus === "ended"
      ) {
        return;
      }
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

export function makeRobotremoveResource({ robotRepo }: RobotDependencies) {
  return async () => {
    relay.on("RobotResourceRemoved", async (event, context) => {
      const { payload } = event;

      const mineResource = makeUpdateInventory({ robotRepo });
      await mineResource(payload);
    });
  };
}
