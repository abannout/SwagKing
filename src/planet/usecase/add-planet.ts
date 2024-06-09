import { PlanetDependencies } from "../../common/dependencies/planet-dependency";
import Planet from "../entity/planet";

export default function makeAddPlanet({ planetRepo }: PlanetDependencies) {
  return async (planet: Planet) => {
    await planetRepo.savePlanet(planet);
  };
}
