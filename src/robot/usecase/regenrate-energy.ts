import { RobotDependencies } from "../../common/dependencies/robot-dependency.js"
import robotService from "./index.js"

export default function makeRegenerateRobot({ robotRepo }: RobotDependencies) {
  return async (robotId: string, availableEnergy: number) => {
    const robot = await robotService.getRobot(robotId)
    if (!robot) throw new Error("Robot has not been found")
    robot.energy = availableEnergy
    await robotRepo.saveRobot(robot)
  }
}
