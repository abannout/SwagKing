import { PlanetDependencies } from "../../common/dependencies/planet-dependency";

export default function makeGetPlanetNeighbours({
  planetRepo,
}: PlanetDependencies) {
  return async (planetId: string) =>
    await planetRepo.getPlanetNeighbours(planetId);
}
