import { sendCommand } from "../../../common/net/client.js";
import { BuyTradableCommand, UpgradeType } from "../../../common/types.js";

export async function buyUpdates(
  robotId: string,
  upgradeType: UpgradeType
): Promise<any> {
  return sendCommand<BuyTradableCommand>({
    type: "buying",
    data: {
      robotId: robotId,
      itemName: upgradeType,
      itemQuantity: 1,
    },
  });
}
