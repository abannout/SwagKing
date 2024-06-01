import Robot from "../entity/robot";
import RobotRepository from "../repo/robotRepo";

interface Dependencies {
  robotRepo: RobotRepository;
}
export default function makegetRobot({ robotRepo }: Dependencies) {
  return async (robot: Robot) => await robotRepo.getRobot(robot.id);
}
