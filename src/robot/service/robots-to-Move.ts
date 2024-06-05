import { RobotDependencies } from "../../common/dependencies/robot-dependency";

//toDo: check for the robot level and enemy if he can move or mine
export default function makeRobotsToMove({ robotRepo }: RobotDependencies) {
  return async () => {
    const allRobots = await robotRepo.getAllRobots();
    const robotsToMove = allRobots.filter(
      (robot) => robot.planet.resourceType === null
    );
    return robotsToMove;
  };
}
