import Robot from "../entity/robot"
import RobotRepository from "../repo/robotRepo"

interface Dependencies {
  robotRepo: RobotRepository
}
export default function makeUpdateRobot({ robotRepo }: Dependencies) {
  return async (robot: Robot) => {
    if (!robot) {
      throw Error("Robot obj is null")
    }
    //toDo: check if robot has been changed
    robotRepo.updateRobot(robot)
  }
}
