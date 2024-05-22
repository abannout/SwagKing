import * as relay from "../net/relay.js";
import logger from "../utils/logger.js";
import * as game from "./game.js";

export * as game from "./game.js";

export function setupStateHandlers() {
  relay.on("RoundStatus", (event, context) => {
    const { payload } = event;

    if (payload.roundStatus === "started") {
      logger.info(`The ${payload.roundNumber}.Round Started ==>`)
      game.set(payload.roundNumber, payload.roundId);
    }
    
  });
}
