import Robot from "../entity/robot";
import RobotRepository from "../repo/robotRepo";
let robotlist: Robot[] = [];

export default function robotDataSource(): RobotRepository {
  return {
    getRobot: async (id: string) => {
      return findObjectById(robotlist, id);
    },
    updateRobot: async (robot: Robot) => {
      const index = robotlist.findIndex((r) => r.id === robot.id);
      if (index === -1) {
        throw new Error(`Robot with ID ${robot.id} not found`);
      }
      robotlist[index] = robot;
    },
    saveRobot: async (robot) => {
      return robotlist.push(robot);
    },
    deleteRobot: async (robot) => {
      const index = robotlist.findIndex((r) => r.id === robot);
      if (index === -1) {
        throw new Error(`Robot with ID ${robot} not found`);
      }
      robotlist.splice(index, 1);
    },
    getAllRobots: async () => {
      return robotlist;
    },
  };
}
const findObjectById = (objects: Robot[], id: string): Robot => {
  const robot = objects.find((obj) => obj.id === id);
  if (!robot) {
    throw new Error(`Robot with ID ${id} not found`);
  }
  return robot;
};
