import { sendCommand } from "../../../common/net/client.js";
import { BuyTradableCommand } from "../../../common/types.js";

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
