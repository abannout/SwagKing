import { sendCommand } from "../../../common/net/client.js";
import { SellTradablesCommand } from "../../../common/types.js";

export async function sellResource(robotId: string): Promise<void> {
  return sendCommand<SellTradablesCommand>({
    type: "selling",
    data: {
      robotId: robotId,
    },
  });
}
//fixme()
// export async function sellResources(robotIds: string[]): Promise<void> {
//     const commandList: Omit<SellTradablesCommand, "playerId">[] = robotIds.map(robotId => ({
//       type: "selling",
//       data: {
//         robotId: robotId,
//       },
//     }));

//     return sendCommandList<SellTradablesCommand>(commandList);
//   }
