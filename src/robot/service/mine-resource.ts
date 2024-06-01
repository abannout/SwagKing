import { RobotResourceMined, RobotResourceRemoved } from "../../common/types";
import { Dependencies } from "../dependencies/robot-dependency";
import Robot from "../entity/robot";

export function makeMineResource({ robotRepo }: Dependencies) {
  return async (): Promise<Robot[]> => {
    const list = await robotRepo.getAllRobots();
    if (list.length == 0) {
      return [];
    }
    const mininglist = list.filter(
      (robot) => robot.planet.resourceType === "COAL" && !robot.inventory.full
    );

    return mininglist;
  };
}

export function makeUpdateInventory({ robotRepo }: Dependencies) {
  return async (
    resourceMined: RobotResourceMined | RobotResourceRemoved
  ): Promise<void> => {
    const list = await robotRepo.getAllRobots();
    if (list.length == 0) {
      return;
    }
    const robot = list.find((robot) => robot.id == resourceMined.robotId);
    if (!robot) {
      throw new Error(
        `cant update Inventory of Robot with id: ${resourceMined.robotId}, because robot does not exist in robot list!!`
      );
    }
    const newRobot = updateRobotInventory(robot, resourceMined);
    await robotRepo.updateRobot(robot);
  };
}

const updateRobotInventory = (
  robot: Robot,
  resourceEvent: RobotResourceMined | RobotResourceRemoved
): Robot => {
  if ("minedAmount" in resourceEvent) {
    robot.inventory.usedStorage += resourceEvent.minedAmount;
  } else if ("removedAmount" in resourceEvent) {
    robot.inventory.usedStorage -= resourceEvent.removedAmount;
  }
  const maxInventory = robot.inventory.maxStorage;
  robot.inventory.full = robot.inventory.usedStorage === maxInventory;
  robot.inventory.resources = resourceEvent.resourceInventory;
  return robot;
};
