// The Commander has access to every state and is responsible of
// deciding on round/game strategies
// The commander will be notified about events and updates the
// strategy according to it.
// We really want to decouple the various strategies from our
// state implementation to keep it really portable.

import { buyRobots } from "../commands";
import { CommandFunction, CommanderNotification } from "../types";

// import { bank, fleet, map, price, radar } from "../state/state";

// Each round we can issue commands on per-robot basis and
// one global command
type CommandRegistry = {
  global?: CommandFunction;
  robots: Record<string, CommandFunction>;
};
const commands: CommandRegistry = {
  robots: {},
};

function clearRegistry() {
  delete commands.global;
  commands.robots = {};
}

export function fetchCommands(): CommandFunction[] {
  const arr = [];
  if (commands.global) {
    arr.push(commands.global);
  }
  arr.push(...Object.values(commands.robots));
  clearRegistry();
  return arr;
}

export function notify(notification: CommanderNotification) {
  // First action is buying robots
  if (notification.type === "game" && notification.status === "started") {
    commands.global = () => buyRobots(5);
  }
}
