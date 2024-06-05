import planetDataSource from "../../planet/data-access/planet-db.js";
import robotDataSource from "../data-access/robot-db.js";
import { makeAddRobot } from "./add-robot.js";
import { makeRobotMineResource } from "./mine-robot.js";
import { handleRobotMoved, makeRobotMove } from "./move-robot.js";
import { handleUpdateInventory } from "./update-robot.js";

const addRobot = makeAddRobot(
  {
    robotRepo: robotDataSource(),
  },
  { planetRepo: planetDataSource() }
);
const mineResource = makeRobotMineResource({ robotRepo: robotDataSource() });
const updateInventory = handleUpdateInventory({ robotRepo: robotDataSource() });
const moveRobot = makeRobotMove(
  {
    robotRepo: robotDataSource(),
  },
  { planetRepo: planetDataSource() }
);
const robotMoved = handleRobotMoved(
  {
    robotRepo: robotDataSource(),
  },
  { planetRepo: planetDataSource() }
);
export const setupRobot = () => {
  addRobot();
  mineResource();
  updateInventory();
  moveRobot();
  robotMoved();
};
