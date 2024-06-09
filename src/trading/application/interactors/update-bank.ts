import * as relay from "../../../common/net/relay.js";
import logger from "../../../utils/logger.js";
import bankService from "../../usecase/index.js";

export function handleUpdateBank() {
  return async () => {
    relay.on("BankAccountTransactionBooked", async (event, context) => {
      const { payload } = event;
      //refactor
      await bankService.updateBankBalance(payload.balance);
      logger.info(
        `Bank has been updated, the new Balance is: ${payload.balance}`
      );
    });
  };
}
