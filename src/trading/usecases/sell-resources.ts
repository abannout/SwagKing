import * as relay from "../../common/net/relay.js";
import { Dependencies } from "../../robot/dependencies/robot-dependency.js";
import makeSellResources from "../../robot/service/sell-resources.js";
import { getCurrentRoundNumber } from "../../state/game.js";
import logger from "../../utils/logger.js";
import { sellResource } from "./commands/sell-resources.js";

export function handleSellResources({ robotRepo }: Dependencies) {
  return async () => {
    relay.on("RoundStatus", async (event, context) => {
      const { payload } = event;
      if (
        payload.roundStatus === "command input ended" ||
        payload.roundStatus === "ended"
      ) {
        return;
      }

      try {
        const makereturnList = makeSellResources({ robotRepo });
        const robotList = await makereturnList();
        if (!robotList || robotList.length <= 0) {
          logger.info(
            "Can't sell any resources for the round: " + getCurrentRoundNumber()
          );
          return;
        }

        robotList.forEach(async (robot) => {
          await sellResource(robot.id);
          logger.info(
            `sold resources for robot: ${robot.id} with player id: ${context.playerId} ${context.playerExchange}`
          );
        });
        robotList.length = 0;
      } catch (error) {
        logger.error(
          "Error handling sell resources: " + (error as Error).message
        );
      }
    });
  };
}
