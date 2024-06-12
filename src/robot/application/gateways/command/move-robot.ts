import { sendCommand } from "../../../../common/net/client.js"
import { MoveCommand } from "../../../../common/types.js"

export async function moveRobot(
  robotId: string,
  planetId: string
): Promise<void> {
  return sendCommand<MoveCommand>({
    type: "movement",
    data: {
      planetId: planetId,
      robotId: robotId,
    },
  })
}
