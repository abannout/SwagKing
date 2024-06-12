import logger from "../../../utils/logger.js"
import * as relay from "../../../common/net/relay.js"
import { updatePlanet } from "../../usecase/index.js"

export function makeRemovePlanetResource() {
  return async () => {
    relay.on("ResourceMined", async (event, context) => {
      const { payload } = event
      logger.info(
        `${payload.minedAmount} ${payload.resource.type} from Planet with id: ${payload.planet} have been mined`
      )
      await updatePlanet(payload.planet, payload.resource)
    })
  }
}
