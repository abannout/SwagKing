import { PlanetDependencies } from "../../common/dependencies/planet-dependency";

export default function makeGetAllPlanets({ planetRepo }: PlanetDependencies) {
  return async (planetId: string): Promise<string[]> =>
    await planetRepo.getPlanetsForRobotId(planetId);
}
