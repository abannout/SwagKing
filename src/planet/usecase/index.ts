import planetDataSource from "../data-access/planet-db.js"
import makeAddPlanet from "./add-planet.js"
import makeDeletePlanet from "./delete-planet.js"
import makeGetAllPlanets from "./get-all-planets.js"
import makeGetPlanetNeighbours from "./get-neighbours.js"
import makeGetPlanet from "./get-planet.js"
import makeMoveToPlanet from "./move-to-planet.js"
import makeSavePlanetForRobot from "./save-planet-robot.js"
import makeUpdatePlanet from "./update-planet.js"

const addPlanet = makeAddPlanet({ planetRepo: planetDataSource() })
const deletePlanet = makeDeletePlanet({ planetRepo: planetDataSource() })
const getAllPlanets = makeGetAllPlanets({
  planetRepo: planetDataSource(),
})
const getPlanetNeighbours = makeGetPlanetNeighbours({
  planetRepo: planetDataSource(),
})
const getPlanet = makeGetPlanet({ planetRepo: planetDataSource() })
const getPlanetToMoveTo = makeMoveToPlanet({ planetRepo: planetDataSource() })
const savePlanetForRobot = makeSavePlanetForRobot({
  planetRepo: planetDataSource(),
})
const updatePlanet = makeUpdatePlanet({ planetRepo: planetDataSource() })
const planetService = Object.freeze({
  addPlanet,
  deletePlanet,
  getAllPlanets,
  getPlanetNeighbours,
  getPlanet,
  getPlanetToMoveTo,
  savePlanetForRobot,
  updatePlanet,
})

export default planetService
export {
  addPlanet,
  deletePlanet,
  getAllPlanets,
  getPlanetNeighbours,
  getPlanet,
  getPlanetToMoveTo,
  savePlanetForRobot,
  updatePlanet,
}
