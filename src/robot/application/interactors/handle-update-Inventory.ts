import * as relay from "../../../common/net/relay.js";
import logger from "../../../utils/logger.js";
import { updateRobotInventory } from "../../usecase/index.js";
export function handleUpdateInventory() {
  return async () => {
    relay.on("RobotResourceMined", async (event, context) => {
      const { payload } = event;
      logger.info(
        `Robot with id: ${payload.robotId} has mined ${payload.minedAmount} of ${payload.minedResource}`
      );
      try {
        await updateRobotInventory(payload);
        logger.info(
          `The Robot with the Id: ${
            payload.robotId
          } now has this resources in his inventory ${JSON.stringify(
            payload.resourceInventory
          )}`
        );
      } catch (e) {
        logger.error((e as Error).message);
        logger.error("could not update the inventory of a robot!!");
      }
    });
  };
}
