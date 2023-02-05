// The Commander has access to every state and is responsible of
// deciding on round/game strategies
// The commander will be notified about events and updates the
// strategy according to it.
// We really want to decouple the various strategies from our
// state implementation to keep it really portable.

import { buyRobots } from "../commands";
import { CommandFunction, CommanderNotification } from "../types";

// import { bank, fleet, map, price, radar } from "../state/state";

const commands: CommandFunction[] = [];

export function fetchCommands(): CommandFunction[] {
  return [...commands];
}

export function notify(notification: CommanderNotification) {
  // First action is buying robots
  if (notification.type === "game" && notification.status === "started") {
    commands.push(() => buyRobots(5));
  }
}
