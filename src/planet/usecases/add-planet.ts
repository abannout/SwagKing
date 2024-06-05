import logger from "../../utils/logger.js";
import * as relay from "../../common/net/relay.js";
import makeAddPlanetService from "../service/add-planet.js";
import { PlanetDependencies } from "../../common/dependencies/planet-dependency.js";

export function makeAddPlanet({ planetRepo }: PlanetDependencies) {
  return async () => {
    relay.on("PlanetDiscovered", async (event, context) => {
      const { payload } = event;
      logger.info(`Planet with id: ${payload.planet} been discovered`);

      const addPlanet = makeAddPlanetService({ planetRepo });
      await addPlanet(payload);
    });
  };
}
