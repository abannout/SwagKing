import { RobotDependencies } from "../../common/dependencies/robot-dependency";
import Robot from "../entity/robot";

export default function makegetRobot({ robotRepo }: RobotDependencies) {
  return async (robotId: string) => await robotRepo.getRobot(robotId);
}

export function makeGetAllRobots({ robotRepo }: RobotDependencies) {
  return async () => await robotRepo.getAllRobots();
}
