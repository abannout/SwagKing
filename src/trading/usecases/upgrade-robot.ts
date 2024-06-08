import { RobotDependencies } from "../../common/dependencies/robot-dependency.js";
import * as relay from "../../common/net/relay.js";
import logger from "../../utils/logger.js";
import BankRepository from "../repo/bankRepo.js";
import makegetBank from "../service/get-bank.js";
import { buyUpdates } from "./commands/upgrade-robot.js";

interface Dependencies {
  bankRepo: BankRepository;
}
//toDo: always check if bank has money before upgrading
export function makeUpgradeRobotLevel(
  { robotRepo }: RobotDependencies,
  { bankRepo }: Dependencies
) {
  return async () => {
    relay.on("RoundStatus", async (event, context) => {
      const { payload } = event;

      if (payload.roundStatus === "started" && payload.roundNumber > 2) {
        const robotToUpgrade = await robotRepo.getAllRobots();
        logger.info(`trying to buy upgrade for ${robotToUpgrade.length}`);
        const getBank = makegetBank({ bankRepo });
        robotToUpgrade.map(async (robot) => {
          const balance = await getBank();
          // console.log(JSON.stringify(robot));
          if (
            balance >= 50 * robotToUpgrade.length &&
            robot.robotLevels.damageLevel < 1
          ) {
            console.log(balance >= 50 * robotToUpgrade.length);
            console.log(robot.robotLevels.damageLevel < 1);
            console.log((await buyUpdates(robot.id, "DAMAGE")).status);
          }
        });
      }
    });
  };
}
