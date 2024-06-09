import { handleAddRobot } from "./interactors/handle-add-robot.js";
import { handleRobotMoved } from "./interactors/move-robot.js";
import { handleUpdateRobotLevel } from "./interactors/update-robot-level.js";
import { handleUpdateInventory } from "./interactors/handle-update-Inventory.js";
import { handleRobotResourceRemoved } from "./interactors/mine-robot.js";

const handleAddRobotEvent = handleAddRobot();
const handleUpdateInventoryEvent = handleUpdateInventory();
const handleRobotResourceRemovedEvent = handleRobotResourceRemoved();
const handleRobotMovedEvent = handleRobotMoved();
const handleUpdateRobotLevelEvent = handleUpdateRobotLevel();

export const handleEventsForRobot = () => {
  handleAddRobotEvent();
  handleUpdateInventoryEvent();
  handleRobotResourceRemovedEvent();
  handleRobotMovedEvent();
  handleUpdateRobotLevelEvent();
};
