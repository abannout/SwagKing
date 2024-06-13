import logger from "../../../utils/logger.js"
import * as relay from "../../../common/net/relay.js"
import robotService from "../../usecase/index.js"

export function handleRobotRgenerated() {
  return async () => {
    relay.on("RobotRegenerated", async (event, context) => {
      const { payload } = event
      logger.info(
        "enrgey generated for" + payload.robotId + "Resource for Robot: "
      )
      await robotService.regenerateRobot(
        payload.robotId,
        payload.availableEnergy
      )
    })
  }
}
