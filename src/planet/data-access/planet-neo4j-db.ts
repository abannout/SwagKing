// import { Planet } from "../../common/types"
// import { driver } from "../../db/planet-neo4j-db"
// import logger from "../../utils/logger"
// import PlanetRepository from "../repo/planetRepo"

// export default function planetDataSource(): PlanetRepository {
//   return {
//     getPlanet: async (id: string) => {
//       if (!id) {
//         logger.error("the planet id is undefined!!")
//         throw new Error("the planet id is undefined!!")
//       }
//       const session = driver.session()
//       return findObjectById(planetList, id)
//     },
//     updatePlanet: async (planet: Planet) => {
//       const index = planetList.findIndex((r) => r.planet === planet.planet)
//       if (index === -1) {
//         throw new Error(`planet with ID ${planet.planet} not found`)
//       }
//       planetList[index] = planet
//     },
//     savePlanet: async (planet) => {
//       planetList.push(planet)
//     },
//     deletePlanet: async (planet) => {
//       const index = planetList.findIndex((r) => r.planet === planet)
//       if (index === -1) {
//         throw new Error(`Robot with ID ${planet} not found`)
//       }
//       planetList.splice(index, 1)
//     },
//     getMap: async () => {
//       return planetList
//     },
//     getPlanetNeighbours: async (planet) => {
//       return findObjectById(planetList, planet).neighbours
//     },
//     savePlanetForRobot: async (robotId: string, planetId: string) => {
//       if (!robotPlanetMap[robotId]) {
//         robotPlanetMap[robotId] = []
//       }
//       robotPlanetMap[robotId].push(planetId)
//     },
//     getPlanetsForRobotId: async (robotId: string) => {
//       return robotPlanetMap[robotId] || []
//     },
//   }
// }
// const findObjectById = (objects: Planet[], id: string): Planet => {
//   const planet = objects.find((obj) => obj.planet === id)
//   if (!planet) {
//     throw new Error(`planet with ID ${id} not found`)
//   }
//   return planet
// }
