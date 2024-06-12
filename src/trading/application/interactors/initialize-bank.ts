import * as relay from "../../../common/net/relay.js"
import logger from "../../../utils/logger.js"
import bankService from "../../usecase/index.js"
import mapToBank from "../mappers/map-to-bank.js"

export function handleInitializeBank() {
  return async () => {
    relay.on("BankAccountInitialized", async (event, context) => {
      const { payload } = event
      const bank = mapToBank(event)

      if (!bank) {
        logger.error(`Bank is undefined`)
        throw new Error("Bank is undefined")
      }

      await bankService.addBank(bank)
      logger.info(`Bank has been initialized with balance: ${payload.balance}`)
    })
  }
}
