import { RobotDependencies } from "../../common/dependencies/robot-dependency.js";
import Robot from "../entity/robot.js";

export default function makeSellResources({ robotRepo }: RobotDependencies) {
  return async function sellResources(): Promise<Robot[]> {
    const list = await robotRepo.getAllRobots();
    if (list.length == 0) {
      return [];
    }
    const robotWithMaxStorage: Robot[] = list.filter(
      (robot: Robot) => robot.inventory.full
    );
    return robotWithMaxStorage;
  };
}
