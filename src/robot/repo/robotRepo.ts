import Robot from "../entity/robot.js"

export default interface RobotRepository {
  getRobot(id: string): Promise<Robot | undefined>
  updateRobot(robot: Robot): Promise<void>
  saveRobot(robot: Robot): Promise<void>
  deleteRobot(id: string): Promise<void>
  getAllRobots(): Promise<Robot[]>
}
