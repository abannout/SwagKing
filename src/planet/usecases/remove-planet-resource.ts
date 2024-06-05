import logger from "../../utils/logger.js";
import * as relay from "../../common/net/relay.js";
import makeUpdatePlanet from "../service/update-planet.js";
import { PlanetDependencies } from "../../common/dependencies/planet-dependency.js";

export function makeRemovePlanetResource({ planetRepo }: PlanetDependencies) {
  return async () => {
    relay.on("ResourceMined", async (event, context) => {
      const { payload } = event;
      logger.info(
        `${payload.minedAmount} ${payload.resource.type} from Planet with id: ${payload.planet} have been mined`
      );
      const addPlanet = makeUpdatePlanet({ planetRepo });
      await addPlanet(payload.planet, payload.resource);
    });
  };
}
