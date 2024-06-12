import logger from "../../../utils/logger.js"
import * as relay from "../../../common/net/relay.js"
import robotService from "../../usecase/index.js"
import planetService from "../../../planet/usecase/index.js"

export function handleRobotMoved() {
  return async () => {
    relay.on("RobotMoved", async (event, context) => {
      const { payload } = event
      const robot = await robotService.getRobot(payload.robotId)
      if (!robot) return
      robot.planet.planetId = payload.toPlanet.id
      const planet = await planetService.getPlanet(payload.toPlanet.id)
      robot.planet.resourceType = planet.resource?.type || null
      robot.energy = payload.remainingEnergy
      robotService.updateRobot(robot)
      logger.info("robot placment has been updated!!!")
    })
  }
}
