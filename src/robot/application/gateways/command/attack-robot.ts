import { sendCommand } from "../../../../common/net/client.js"
import { BattleCommand } from "../../../../common/types.js"

export async function attackRobot(
  robotId: string,
  targetId: string
): Promise<void> {
  return sendCommand<BattleCommand>({
    type: "battle",
    data: {
      robotId: robotId,
      targetId: targetId,
    },
  })
}
