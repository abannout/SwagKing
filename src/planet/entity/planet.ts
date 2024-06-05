import { ResourceDefinition } from "../../common/types";
import PlanetNeighbour from "./planet-neighbour";

export default interface Planet {
  planet: string;
  movementDifficulty: number;
  neighbours: PlanetNeighbour[];
  resource: ResourceDefinition | null | undefined;
}
