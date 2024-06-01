import Robot from "../entity/robot";
import RobotRepository from "../repo/robotRepo";

interface Dependencies {
  robotRepo: RobotRepository;
}
export default function makeaddRobot({ robotRepo }: Dependencies) {
  return async (robot: Robot) => await robotRepo.saveRobot(robot);
}
