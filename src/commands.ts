import { sendCommand } from "./net/client.js";
import { bank, fleet, map, price } from "./state/state.js";
import {
  AttackCommand,
  BuyCommand,
  BuyRobotCommand,
  MineCommand,
  MoveCommand,
  RegenerateCommand,
  Robot,
  SellCommand,
  SpottedRobot,
  Tradable,
} from "./types";
import logger from "./utils/logger.js";

// Command helper library

export async function buyRobots(amount: number): Promise<void> {
  logger.info(`Buying ${amount} robots`);
  const p = price.get("ROBOT");
  if (p === undefined) throw Error("I don't know how much a robot cost");
  if (p > bank.get()) throw Error("I don't have enough money");

  await sendCommand<BuyRobotCommand>({
    commandType: "buying",
    commandObject: {
      commandType: "buying",
      itemName: "ROBOT",
      itemQuantity: amount,
    },
  });
}

export async function buyItem(
  robotId: string,
  item: Tradable,
  amount = 1
): Promise<void> {
  logger.info(`Buying ${amount}x${item} for robot ${robotId}`);
  const p = price.get(item);
  if (p === undefined) throw Error("I don't know how much it cost");
  if (p > bank.get()) throw Error("I don't have enough money");

  await sendCommand<BuyCommand>({
    commandType: "buying",
    commandObject: {
      commandType: "buying",
      itemName: item,
      itemQuantity: amount,
    },
    robotId: robotId,
  });
}

export async function mine(robot: Pick<Robot, "id">): Promise<void> {
  logger.info(`Mining with robot ${robot.id}`);
  await sendCommand<MineCommand>({
    commandType: "mining",
    robotId: robot.id,
    commandObject: {
      commandType: "mining",
    },
  });
}

export async function attack(
  robot: Pick<Robot, "id">,
  target: Pick<SpottedRobot, "id">
): Promise<void> {
  logger.info(`Attacking ${target.id} with robot ${robot.id}`);
  await sendCommand<AttackCommand>({
    commandType: "battle",
    robotId: robot.id,
    commandObject: {
      commandType: "battle",
      targetId: target.id,
    },
  });
}

export async function sell(robot: Pick<Robot, "id">): Promise<void> {
  logger.info(`Selling resources of robot ${robot.id}`);
  await sendCommand<SellCommand>({
    commandType: "selling",
    robotId: robot.id,
    commandObject: {
      commandType: "selling",
    },
  });
}

export async function moveTo(
  robot: Pick<Robot, "id">,
  neighbourId: string
): Promise<void> {
  const fleetRobot = fleet.get(robot.id);
  if (fleetRobot === undefined) throw Error("");
  const currentPlanet = fleetRobot.planet;
  if (currentPlanet === neighbourId) {
    throw Error("Can't move to the same planet");
  }
  if (!map.areNeighbours(currentPlanet, neighbourId)) {
    throw Error("That is not a valid neighbour");
  }

  logger.info(
    `Moving robot robot ${robot.id}: ${fleetRobot.planet} -> ${neighbourId}`
  );
  await sendCommand<MoveCommand>({
    commandType: "movement",
    robotId: robot.id,
    commandObject: {
      commandType: "movement",
      planetId: neighbourId,
    },
  });
}

export async function regenerate(robot: Pick<Robot, "id">): Promise<void> {
  logger.info(`Regenerating robot ${robot.id}`);
  await sendCommand<RegenerateCommand>({
    commandType: "regenerate",
    robotId: robot.id,
    commandObject: {
      commandType: "regenerate",
    },
  });
}
