import * as relay from "../../common/net/relay.js";
import logger from "../../utils/logger.js";
import BankRepository from "../repo/bankRepo.js";
import makeAddBank from "../service/add-bank.js";
import mapToBank from "./mappers/map-to-bank.js";

interface Dependencies {
  bankRepo: BankRepository;
}
export function makeInitializeBank({ bankRepo }: Dependencies) {
  return async () => {
    relay.on("BankAccountInitialized", async (event, context) => {
      const { payload } = event;
      const addBank = await makeAddBank({ bankRepo });
      const bank = mapToBank(event);

      if (!bank) {
        logger.error(`Bank is undefined`);
        throw new Error("Bank is undefined");
      }

      await addBank(bank);
      logger.info(`Bank has been initialized with balance: ${payload.balance}`);
    });
  };
}
