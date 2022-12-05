import {
  BuyRobotCommand,
  MineCommand,
  MoveCommand,
  Planet,
  Robot,
  SellCommand,
} from "./types";
import { sendCommand } from "./client";
import map from "./map";
import { send } from "process";
import logger from "./logger";

// Command helper library

export async function buyRobots(amount: number): Promise<void> {
  logger.info(`Buying ${amount} robots`);
  await sendCommand<BuyRobotCommand>({
    commandType: "buying",
    commandObject: {
      commandType: "buying",
      itemName: "robot",
      itemQuantity: amount,
    },
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

export async function moveToRandomNeighbour(robot: Robot): Promise<void> {
  const planet = map.get(robot.planet.planetId);
  if (!planet) {
    throw new Error("Planet not found");
  }
  const neighbours = planet.neighbours;
  const randomNeighbour =
    neighbours[Math.floor(Math.random() * neighbours.length)];
  await moveTo(robot, randomNeighbour.id);
}
