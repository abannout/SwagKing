import { sendCommand } from "../../../../common/net/client.js";
import { BuyUpgradesCommand, UpgradeType } from "../../../../common/types.js";

export async function buyUpdates(
  robotId: string,
  upgradeType: UpgradeType,
  planetId: string
): Promise<any> {
  return sendCommand<BuyUpgradesCommand>({
    type: "buying",
    data: {
      robotId: robotId,
      planetId: planetId,
      itemName: upgradeType,
      itemQuantity: 1,
    },
  });
}
