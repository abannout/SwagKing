import Robot from "../entity/robot";

export default interface RobotRepository {
  getRobot(id: string): Promise<Robot>;
  updateRobot(robot: Robot): Promise<void>;
  saveRobot(robot: Robot): Promise<number>;
  deleteRobot(id: string): Promise<void>;
  getAllRobots(): Promise<Robot[]>;
}
