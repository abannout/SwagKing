import logger from "../../../utils/logger.js";
import * as relay from "../../../common/net/relay.js";
import { addPlanet } from "../../usecase/index.js";

export function handleAddPlanet() {
  return async () => {
    relay.on("PlanetDiscovered", async (event, context) => {
      const { payload } = event;
      logger.info(`Planet with id: ${payload.planet} been discovered`);

      await addPlanet(payload);
    });
  };
}
