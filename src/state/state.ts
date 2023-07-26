import * as relay from "../net/relay.js";
import * as game from "./game.js";

export * as game from "./game.js";

export function setupStateHandlers() {
  relay.on("round-status", (event, context) => {
    const { payload } = event;

    if (payload.roundStatus === "started") {
      game.set(payload.roundNumber, payload.roundId);
    }
  });
}
