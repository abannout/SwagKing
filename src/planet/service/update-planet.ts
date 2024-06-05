import { PlanetDependencies } from "../../common/dependencies/planet-dependency";
import { ResourceDefinition } from "../../common/types";

export default function makeUpdatePlanet({ planetRepo }: PlanetDependencies) {
  return async (planetId: string, resource: ResourceDefinition) => {
    const planet = await planetRepo.getPlanet(planetId);
    if (!planet) throw Error("planet doesnt exist in database");
    planet.resource = resource;
    await planetRepo.updatePlanet(planet);
  };
}
