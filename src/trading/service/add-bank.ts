import logger from "../../utils/logger.js";
import Bank from "../entity/bank.js";
import BankRepository from "../repo/bankRepo.js";

interface Dependencies {
  bankRepo: BankRepository;
}
export default function makeAddBank({ bankRepo }: Dependencies) {
  return async (bank: Bank) => {
    logger.info("adding bank with balance: " + bank.money.amount);
    await bankRepo.saveBank(bank);
  };
}
