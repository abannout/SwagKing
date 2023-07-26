import { sendCommand } from "./net/client.js";
import { BuyRobotCommand } from "./types";

// This is an example problem that shows how commands can be sent.
export async function buyRobots(amount: number): Promise<void> {
  return sendCommand<BuyRobotCommand>({
    commandType: "buying",
    commandObject: {
      commandType: "buying",
      itemName: "ROBOT",
      itemQuantity: amount,
    },
  });
}
