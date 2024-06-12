import logger from "../../../utils/logger.js"
import * as relay from "../../../common/net/relay.js"
import robotService from "../../usecase/index.js"
import { makeRobot } from "../../entity/robot.js"
//toDo save robot instead of spawnedRobot
export function handleAddRobot() {
  return async () => {
    relay.on("RobotSpawned", async (event, context) => {
      const { payload } = event
      logger.info(`Robot has been spawned with id: ${payload.robot.id}`)
      const newRobot = makeRobot(payload)

      const robotsNumber = robotService.addRobot(newRobot)
      logger.info(
        `Robot has been spawned with id: ${payload.robot.id}. you now have ${robotsNumber} Robots in the Map`
      )
    })
  }
}
