import * as relay from "../net/relay.js";
import { bank, fleet } from "../state/state.js";
import * as strategies from "./strategies/strategies.js";

const NICE_AMOUNT_MONETEN = 1_000;
let ATTACK_LATCH_COUNTER = 0;

export function setupInstructor() {
  relay.on("round-status", (event) => {
    const status = event.payload.roundStatus;
    if (status === "command input ended") {
      return;
    }

    if (status === "started") {
      if (event.payload.roundNumber % 5 === 0) {
        strategies.reconcileStrategyDistribution();
      }

      if (bank.get() < NICE_AMOUNT_MONETEN) {
        strategies.increaseStrategyBias("FARMING");
      } else {
        strategies.decreaseStrategyBias("FARMING");
      }

      strategies.decreaseStrategyBias(
        "EXPLORING",
        0.005 * event.payload.roundNumber
      );
      strategies.increaseStrategyBias(
        "FIGHTING",
        0.05 * event.payload.roundNumber
      );

      ATTACK_LATCH_COUNTER--;
      if (ATTACK_LATCH_COUNTER < 0) {
        ATTACK_LATCH_COUNTER = 0;
      }
    }
  });

  relay.on("game-status", (event) => {
    const status = event.payload.status;
    if (status === "created") {
      return;
    }
  });

  relay.on("RobotAttackedIntegrationEvent", (event) => {
    const target = fleet.get(event.payload.target.robotId);
    // If we are getting attacked, we get more angry
    if (target) {
      ATTACK_LATCH_COUNTER++;
      strategies.increaseStrategyBias("FIGHTING", ATTACK_LATCH_COUNTER);
    }
  });
}
