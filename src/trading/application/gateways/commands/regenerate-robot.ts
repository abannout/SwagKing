import { sendCommand } from "../../../../common/net/client.js"
import { RegenerateCommand } from "../../../../common/types.js"

export async function regenerateRobot(robotId: string): Promise<void> {
  return sendCommand<RegenerateCommand>({
    type: "regenerate",
    data: {
      robotId: robotId,
    },
  })
}
