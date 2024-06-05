import Planet from "../entity/planet";
import PlanetNeighbour from "../entity/planet-neighbour";

export default interface PlanetRepository {
  getPlanet(id: string): Promise<Planet>;
  updatePlanet(robot: Planet): Promise<void>;
  savePlanet(robot: Planet): Promise<void>;
  deletePlanet(id: string): Promise<void>;
  getPlanetNeighbours(id: string): Promise<PlanetNeighbour[]>;
  getMap(): Promise<Planet[]>;
  savePlanetForRobot(robotId: string, planet: string): Promise<void>;
  getPlanetsForRobotId(robotId: string): Promise<string[]>;
}
