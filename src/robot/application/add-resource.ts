// // import logger from "../../utils/logger.js";
// // import * as relay from "../../common/net/relay.js";
// // import { mineResources } from "./gateways/command/mine-robot.js";
// // import { makeMineResource } from "../usecase/mine-resource.js";
// // import { RobotDependencies } from "../../common/dependencies/robot-dependency.js";

// // export function makeRobotMineResource({ robotRepo }: RobotDependencies) {
// //   return async () => {
// //     relay.on("RobotResourceMined", async (event, context) => {
// //       const { payload } = event;

// //       const mineResource = makeMineResource({ robotRepo });
// //       const list = await mineResource();
// //       if (!list || list.length <= 0) return;
// //       list.forEach((robot) => {
// //         mineResources(robot.id);
// //         logger.info(`mining robot with id: ${robot.id}`);
// //       });
// //     });
// //   };
// // }

// // import logger from "../../utils/logger.js";
// // import * as relay from "../../common/net/relay.js";
// // import { mineResources } from "./command/mine-robot.js";
// // import {
// //   makeMineResource,
// //   makeUpdateInventory,
// // } from "../service/mine-resource.js";
// // import { RobotDependencies } from "../../common/dependencies/robot-dependency.js";

// // //toDo: map the dtos to robotinventory
// // export function makeRobotMineResource({ robotRepo }: RobotDependencies) {
// //   return async () => {
// //     relay.on("RoundStatus", async (event, context) => {
// //       const { payload } = event;

// //       if (
// //         payload.roundStatus === "command input ended" ||
// //         payload.roundStatus === "ended"
// //       ) {
// //         return;
// //       }
// //       const mineResource = makeMineResource({ robotRepo });
// //       const list = await mineResource();
// //       if (!list || list.length <= 0) return;
// //       list.forEach((robot) => {
// //         mineResources(robot.id);
// //         logger.info(`mining robot with id: ${robot.id}`);
// //       });
// //     });
// //   };
// // }

// export function makeRobotMove(
//   { robotRepo }: RobotDependencies,
//   { planetRepo }: PlanetDependencies
// ) {
//   return async () => {
//     relay.on("RoundStatus", async (event, context) => {
//       const { payload } = event;

//       if (
//         payload.roundStatus === "command input ended" ||
//         payload.roundStatus === "ended" ||
//         payload.roundNumber <= 2
//       ) {
//         return;
//       }
//       const getRobotToMove = makeRobotsToMove({ robotRepo });
//       const robotToMove = await getRobotToMove();
//       const getMoveToPlanet = makeMoveToPlanet({ planetRepo });
//       if (!robotToMove || robotToMove.length <= 0) return;
//       robotToMove.forEach(async (robot) => {
//         const planetToMoveTo = await getMoveToPlanet(robot);
//         logger.info(
//           `Moving robot with id: ${robot.id} to Planet with id: ${planetToMoveTo}`
//         );
//         moveRobot(robot.id, planetToMoveTo);
//       });
//       robotToMove.length = 0;
//     });
//   };
// }
