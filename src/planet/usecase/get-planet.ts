import { PlanetDependencies } from "../../common/dependencies/planet-dependency";

export default function makeGetPlanet({ planetRepo }: PlanetDependencies) {
  return async (planetId: string) => await planetRepo.getPlanet(planetId);
}
