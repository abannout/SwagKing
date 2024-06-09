// import * as relay from "../../common/net/relay.js";
// import { getCurrentRoundNumber } from "../../state/game.js";
// import logger from "../../utils/logger.js";
// import bankService from "../usecase/index.js";
// import { buyRobots } from "./gateways/commands/buy-robot.js";

// export function makeBuyRobots() {
//   return async () => {
//     relay.on("RoundStatus", async (event, context) => {
//       const { payload } = event;

//       if (payload.roundStatus === "started" && payload.roundNumber < 3) {
//         const bankBalance = await bankService.getBank();
//         logger.info(
//           `bank balance is ${bankBalance}  for Round number ${getCurrentRoundNumber()}`
//         );

//         const canBuyRobots = Math.floor(bankBalance / 100);
//         logger.info(
//           `trying to buy ${canBuyRobots} Robots for Round number ${getCurrentRoundNumber()}`
//         );
//         console.log((await buyRobots(1)).status);
//       }
//     });
//   };
// }
