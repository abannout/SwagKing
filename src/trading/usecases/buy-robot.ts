import * as relay from "../../common/net/relay.js";
import { getCurrentRoundNumber } from "../../state/game.js";
import logger from "../../utils/logger.js";
import BankRepository from "../repo/bankRepo.js";
import { buyRobots } from "./commands/buy-robot.js";

interface Dependencies {
  bankRepo: BankRepository;
}
export function makeBuyRobots({ bankRepo }: Dependencies) {
  return async () => {
    relay.on("RoundStatus", async (event, context) => {
      const { payload } = event;

      if (payload.roundStatus === "started") {
        const bankBalance = (await bankRepo.getBank()).money.amount;
        logger.info(
          `bank balance is ${bankBalance}  for Round number ${getCurrentRoundNumber()}`
        );

        const canBuyRobots = Math.floor(bankBalance / 100);
        logger.info(
          `trying to buy ${canBuyRobots} Robots for Round number ${getCurrentRoundNumber()}`
        );
        buyRobots(canBuyRobots);
      }
    });
  };
}
