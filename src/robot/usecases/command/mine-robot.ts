import { sendCommand } from "../../../common/net/client.js";
import { MineCommand } from "../../../common/types.js";

export async function mineResources(robotId: string): Promise<void> {
  return sendCommand<MineCommand>({
    type: "mining",
    data: {
      robotId: robotId,
    },
  });
}
