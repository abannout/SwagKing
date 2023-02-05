// The Commander has access to every state and is responsible of
// deciding on round/game strategies
// The commander will be notified about events and updates the
// strategy according to it.
// We really want to decouple the various strategies from our
// state implementation to keep it really portable.

import { buyRobots } from "../commands";
import { CommandFunction, CommanderNotification } from "../types";

import { bank, fleet, price } from "../state/state";

const MAX_FLEET_SIZE = 30;
const DEFAULT_ROBOT_BUY_BATCH_SIZE = 5;

function calculateRobotBuyAmount(): number {
  const robotPrice = price.get("ROBOT") || Number.MAX_VALUE;
  const balance = bank.get();
  const maxBuyableAmount = Math.floor(balance / robotPrice);

  return Math.min(DEFAULT_ROBOT_BUY_BATCH_SIZE, maxBuyableAmount);
}

export function fetchCommands(): CommandFunction[] {
  const arr: CommandFunction[] = [];
  const fleetSize = fleet.size();
  const shouldBuyRobots = fleetSize < MAX_FLEET_SIZE;
  if (shouldBuyRobots) {
    const buyAmount = calculateRobotBuyAmount();
    if (buyAmount > 0) {
      arr.push(() => buyRobots(buyAmount));
    }
  }
  return arr;
}

export function notify(notification: CommanderNotification) {
  return;
}
