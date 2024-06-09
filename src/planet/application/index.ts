import { handleAddPlanet } from "./interactors/add-planet.js";
import { makeRemovePlanetResource as handleRemovePlanetResource } from "./interactors/remove-planet-resource.js";

const handleAddPlanetEvent = handleAddPlanet();
const handleRemovePlanetResourceEvent = handleRemovePlanetResource();

export const handleEventsForPlanet = () => {
  handleAddPlanetEvent();
  handleRemovePlanetResourceEvent();
};
