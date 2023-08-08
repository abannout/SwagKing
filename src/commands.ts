import { sendCommand } from "./net/client.js";
import { BuyTradableCommand } from "./types";

// This is an example problem that shows how commands can be sent.
export async function buyRobots(amount: number): Promise<void> {
  return sendCommand<BuyTradableCommand>({
    type: "buying",
    data: {
      robotId: null,
      itemName: "ROBOT",
      itemQuantity: amount,
    },
  });
}
