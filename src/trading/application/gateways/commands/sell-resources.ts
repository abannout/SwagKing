import { sendCommand } from "../../../../common/net/client.js";
import { SellTradablesCommand } from "../../../../common/types.js";

export async function sellResource(robotId: string): Promise<void> {
  return sendCommand<SellTradablesCommand>({
    type: "selling",
    data: {
      robotId: robotId,
    },
  });
}
