import planetDataSource from "../../planet/data-access/planet-db.js";
import robotDataSource from "../data-access/robot-db.js";
import makeaddRobot from "./add-robot.js";
import makegetRobot, { makeGetAllRobots } from "./get-robot.js";
import { makeMineResource, makeUpdateInventory } from "./mine-resource.js";
import makeRobotsToMove from "./robots-to-Move.js";
import makeSellResources from "./sell-resources.js";
import makeUpdateRobot from "./update-robot.js";

const addRobot = makeaddRobot(
  {
    robotRepo: robotDataSource(),
  },
  { planetRepo: planetDataSource() }
);
const moveRobot = makeRobotsToMove({
  robotRepo: robotDataSource(),
});
const updateRobotInventory = makeUpdateInventory({
  robotRepo: robotDataSource(),
});
const sellResources = makeSellResources({
  robotRepo: robotDataSource(),
});
const robotsToMove = makeRobotsToMove({ robotRepo: robotDataSource() });
const getRobot = makegetRobot({ robotRepo: robotDataSource() });
const getAllRobots = makeGetAllRobots({ robotRepo: robotDataSource() });
const updateRobot = makeUpdateRobot({ robotRepo: robotDataSource() });
const mineResource = makeMineResource({ robotRepo: robotDataSource() });
const robotService = Object.freeze({
  addRobot,
  moveRobot,
  updateRobotInventory,
  robotsToMove,
  sellResources,
  getRobot,
  getAllRobots,
  updateRobot,
  mineResource,
});

export default robotService;
export {
  addRobot,
  moveRobot,
  updateRobotInventory,
  robotsToMove,
  sellResources,
  getRobot,
  getAllRobots,
  updateRobot,
  mineResource,
};
