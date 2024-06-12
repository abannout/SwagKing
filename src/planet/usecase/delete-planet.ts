import { PlanetDependencies } from "../../common/dependencies/planet-dependency"

export default function makeDeletePlanet({ planetRepo }: PlanetDependencies) {
  return async (planetId: string) => await planetRepo.deletePlanet(planetId)
}
