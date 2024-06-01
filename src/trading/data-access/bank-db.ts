import Bank from "../entity/bank";
import BankRepository from "../repo/bankRepo";
let bankAccount: Bank = {
  playerId: "",
  money: {
    amount: 0,
  },
};
export default function bankDataSource(): BankRepository {
  return {
    getBank: async () => {
      return bankAccount;
    },
    setBankMoney: async (money) => {
      bankAccount.money.amount = money;
    },
    saveBank: async (bank) => {
      bankAccount = bank;
      console.log(bank.money.amount);
    },
  };
}
