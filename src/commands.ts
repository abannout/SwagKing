import { sendCommand } from "./net/client";
import bank from "./state/bank";
import price from "./state/price";
import {
  BuyCommand,
  BuyRobotCommand,
  MineCommand,
  MoveCommand,
  Robot,
  SellCommand,
  Tradable,
} from "./types";
import logger from "./utils/logger";

// Command helper library

export async function buyRobots(amount: number): Promise<void> {
  logger.info(`Buying ${amount} robots`);
  const p = price.get("ROBOT");
  if (p === undefined) throw Error("I don't know how much a robot cost");
  console.log(bank.get());
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

export async function buy(
  robotId: string,
  item: Tradable,
  amount = 1
): Promise<void> {
  logger.info(`Buying ${amount}x${item} for robot ${robotId}`);
  const p = price.get(item);
  if (p === undefined) throw Error("I don't know how much it cost");
  console.log(bank.get());
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
  logger.info(`Moving robot robot ${robot.id} to planet ${neighbourId}`);
  await sendCommand<MoveCommand>({
    commandType: "movement",
    robotId: robot.id,
    commandObject: {
      commandType: "movement",
      planetId: neighbourId,
    },
  });
}
