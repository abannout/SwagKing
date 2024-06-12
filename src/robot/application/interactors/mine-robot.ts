import logger from "../../../utils/logger.js"
import * as relay from "../../../common/net/relay.js"
import { updateRobotInventory } from "../../usecase/index.js"

export function handleRobotResourceRemoved() {
  return async () => {
    relay.on("RobotResourceRemoved", async (event, context) => {
      const { payload } = event
      logger.info(
        payload.removedAmount +
          "Resource for Robot: " +
          payload.robotId +
          " has been removed"
      )
      await updateRobotInventory(payload)
    })
  }
}
