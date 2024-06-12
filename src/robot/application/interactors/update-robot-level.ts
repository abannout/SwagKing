import * as relay from "../../../common/net/relay.js"
import logger from "../../../utils/logger.js"
import robotService from "../../usecase/index.js"

//test
export function handleUpdateRobotLevel() {
  return async () => {
    relay.on("RobotUpgraded", async (event, context) => {
      const { payload } = event
      logger.info(
        `Robot with id: ${payload.robotId} has been updated ${payload.upgrade} to level ${payload.level}`
      )
      try {
        const robot = await robotService.getRobot(payload.robotId)
        if (!robot) throw new Error("no robot found with this id")
        robot.robotLevels.damageLevel = payload.level
        await robotService.updateRobot(robot)
      } catch (e) {
        logger.error((e as Error).message)
        logger.error("could not update the level of a robot!!")
      }
    })
  }
}
