import { RobotDependencies } from "../../common/dependencies/robot-dependency"
import { RobotResourceMined, RobotResourceRemoved } from "../../common/types"
import Robot from "../entity/robot"

export function makeMineResource({ robotRepo }: RobotDependencies) {
  return async (mininglist: Robot[]): Promise<Robot[]> => {
    if (mininglist.length === 0) {
      return []
    }

    const filteredMiningList = mininglist.filter((robot) => {
      return (
        robot.planet.resourceType !== null &&
        !robot.inventory.full &&
        robot.planet.resourceType === "COAL"
      )
    })

    return filteredMiningList
  }
}

export function makeUpdateInventory({ robotRepo }: RobotDependencies) {
  return async (
    resourceMined: RobotResourceMined | RobotResourceRemoved
  ): Promise<void> => {
    const list = await robotRepo.getAllRobots()
    if (list.length == 0) {
      return
    }
    const robot = list.find((robot) => robot.id == resourceMined.robotId)
    if (!robot) {
      throw new Error(
        `cant update Inventory of Robot with id: ${resourceMined.robotId}, because robot does not exist in robot list!!`
      )
    }
    const newRobot = updateRobotInventory(robot, resourceMined)
    //test
    await robotRepo.updateRobot(newRobot)
  }
}

const updateRobotInventory = (
  robot: Robot,
  resourceEvent: RobotResourceMined | RobotResourceRemoved
): Robot => {
  if ("minedAmount" in resourceEvent) {
    robot.inventory.usedStorage += resourceEvent.minedAmount
  } else if ("removedAmount" in resourceEvent) {
    robot.inventory.usedStorage -= resourceEvent.removedAmount
  }
  const maxInventory = robot.inventory.maxStorage
  robot.inventory.full = robot.inventory.usedStorage === maxInventory
  robot.inventory.resources = resourceEvent.resourceInventory
  return robot
}
