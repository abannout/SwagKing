import Robot from "../entity/robot.js"
import robotService from "./index.js"

export default function makeSellResources() {
  return async (): Promise<Robot[]> => {
    const robots = await robotService.getAllRobots()
    if (robots.length == 0) {
      return []
    }
    const robotWithMaxStorage: Robot[] = robots.filter(
      (robot: Robot) => robot.inventory.full
    )
    return robotWithMaxStorage
  }
}
