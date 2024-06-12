import Robot from "../entity/robot.js"
import RobotRepository from "../repo/robotRepo.js"
const robotlist: Map<string, Robot> = new Map<string, Robot>()

export default function robotDataSource(): RobotRepository {
  return {
    getRobot: async (id: string) => {
      const robot = robotlist.get(id)
      return robot ? robot : undefined
    },
    updateRobot: async (robot: Robot) => {
      if (!robotlist.has(robot.id)) {
        throw new Error(`Robot with ID ${robot.id} not found`)
      }
      robotlist.set(robot.id, robot)
    },
    saveRobot: async (robot) => {
      robotlist.set(robot.id, robot)
    },
    deleteRobot: async (robot) => {
      robotlist.delete(robot)
    },
    getAllRobots: async () => {
      return [...robotlist.values()]
    },
  }
}
