import BankRepository from "../repo/bankRepo.js";

interface Dependencies {
  bankRepo: BankRepository;
}
export default function makegetBank({ bankRepo }: Dependencies) {
  return async () => {
    const balance = await bankRepo.getBank();
    if (balance == null || balance == undefined || balance.money.amount < 0) {
      throw Error("balance is null or smaller than 0");
    }
    return balance.money.amount;
  };
}
