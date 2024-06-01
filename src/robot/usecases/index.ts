import robotDataSource from "../data-access/robot-db.js";
import { makeAddRobot } from "./add-robot.js";
import { makeRobotMineResource } from "./mine-robot.js";
import { handleUpdateInventory } from "./update-robot.js";

const addRobot = makeAddRobot({ robotRepo: robotDataSource() });
const mineResource = makeRobotMineResource({ robotRepo: robotDataSource() });
const updateInventory = handleUpdateInventory({ robotRepo: robotDataSource() });
export const setupRobot = () => {
  addRobot();
  mineResource();
  updateInventory();
};
