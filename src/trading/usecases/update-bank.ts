import * as relay from "../../common/net/relay.js";
import logger from "../../utils/logger.js";
import BankRepository from "../repo/bankRepo.js";
import makeUpdateBankBalance from "../service/update-bank.js";

interface Dependencies {
  bankRepo: BankRepository;
}
export function makeUpdateBank({ bankRepo }: Dependencies) {
  return async () => {
    relay.on("BankAccountTransactionBooked", async (event, context) => {
      const { payload } = event;
      const updateBank = await makeUpdateBankBalance({ bankRepo });

      await updateBank(payload.balance);
      logger.info(
        `Bank has been updated, the new Balance is: ${payload.balance}`
      );
    });
  };
}
