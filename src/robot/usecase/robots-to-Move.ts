import planetService from "../../planet/usecase/index.js"
import Robot from "../entity/robot.js"

//toDo: check for the robot level and enemy if he can move or mine
export default function makeRobotsToMove() {
  return async (robotList: Robot[]): Promise<Robot[]> => {
    if (robotList.length === 0) {
      return []
    }

    const robotsToMove = robotList.filter(async (robot) => {
      const planet = await planetService.getPlanet(robot.planet.planetId)
      console.log(JSON.stringify(robot.energy >= planet.movementDifficulty))
      return (
        robot.energy >= planet.movementDifficulty &&
        robot.planet.resourceType != "COAL"
      )
    })

    return robotsToMove
  }
}
