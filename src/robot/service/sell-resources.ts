import { Robot } from "../../common/types.js";
import { Dependencies } from "../dependencies/robot-dependency.js";

export default function makeSellResources({ robotRepo }: Dependencies) {
  return async function sellResources(): Promise<Robot[]> {
    const list = await robotRepo.getAllRobots();
    if (list.length == 0) {
      return [];
    }
    const robotWithMaxStorage = list.filter((robot) => robot.inventory.full);
    return robotWithMaxStorage;
  };
}
