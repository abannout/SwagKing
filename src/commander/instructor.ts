// The instructors job is to notify the commander about events
import * as relay from "../net/relay";
import * as commander from "./commander";

export function setupInstructor() {
  relay.on("round-status", (event) => {
    const status = event.payload.roundStatus;
    if (status === "command input ended") {
      return;
    }

    commander.notify({
      type: "round",
      status,
    });
  });

  relay.on("game-status", (event) => {
    const status = event.payload.status;
    if (status === "created") {
      return;
    }

    commander.notify({
      type: "game",
      status,
    });
  });
}
