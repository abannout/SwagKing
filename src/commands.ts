import {
  BuyRobotCommand,
  MineCommand,
  MoveCOmmand,
  Planet,
  Robot,
} from "./types";
import { sendCommand } from "./client";
import map from "./map";
import { send } from "process";

// Command helper library

export async function buyRobots(amount: number): Promise<void> {
  await sendCommand<BuyRobotCommand>({
    commandType: "buying",
    commandObject: {
      commandType: "buying",
      itemName: "robot",
      itemQuantity: amount,
    },
  });
}

export async function mine(robot: Robot): Promise<void> {
  await sendCommand<MineCommand>({
    commandType: "mining",
    robotId: robot.id,
    commandObject: {
      commandType: "mining",
    },
  });
}

export async function moveTo(robot: Robot, neighbourId: string): Promise<void> {
  await sendCommand<MoveCOmmand>({
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
