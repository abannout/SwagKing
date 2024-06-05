import planetDataSource from "../data-access/planet-db.js";
import { makeAddPlanet } from "./add-planet.js";
import { makeRemovePlanetResource } from "./remove-planet-resource.js";

const addPlanet = makeAddPlanet({ planetRepo: planetDataSource() });
const removeResourcesFromPlanet = makeRemovePlanetResource({
  planetRepo: planetDataSource(),
});

export const setupPlanet = () => {
  addPlanet();
  removeResourcesFromPlanet();
};
