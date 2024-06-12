import { PlanetNeighbour } from "../../common/types"
import makeGetAllPlanets from "./get-all-planets.js"
import Robot from "../../robot/entity/robot.js"
import { PlanetDependencies } from "../../common/dependencies/planet-dependency.js"
import logger from "../../utils/logger.js"
import { getPlanetNeighbours } from "./index.js"

//export to higher service
export default function makeMoveToPlanet({ planetRepo }: PlanetDependencies) {
  return async (robot: Robot): Promise<string> => {
    if (!robot) {
      throw Error("Robot obj is null")
    }
    const neighbours = await getPlanetNeighbours(robot.planet.planetId)
    logger.info(
      `neighbours for robot with id: ${robot.id} are: ${JSON.stringify(
        neighbours
      )}`
    )
    const getVisitedPlanets = makeGetAllPlanets({ planetRepo })
    const visitedPlanets = await getVisitedPlanets(robot.id)
    return planetToMoveTo(neighbours, visitedPlanets)
  }
}

const planetToMoveTo = (
  neighbours: PlanetNeighbour[],
  visitedPlanets: string[]
): string => {
  if (neighbours.length <= 0) {
    throw new Error("Planet the robot is on has no neighbour planets!!")
  }
  const unvisitedNeighbours = neighbours.filter(
    (neighbour) => !visitedPlanets.includes(neighbour.id)
  )

  if (unvisitedNeighbours.length > 0) {
    const randomIndex = Math.floor(Math.random() * unvisitedNeighbours.length)
    return unvisitedNeighbours[randomIndex].id
  } else {
    const randomIndex = Math.floor(Math.random() * neighbours.length)
    return neighbours[randomIndex].id
  }
}
