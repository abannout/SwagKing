import BankRepository from "../repo/bankRepo.js"

interface Dependencies {
  bankRepo: BankRepository
}
export default function makeUpdateBankBalance({ bankRepo }: Dependencies) {
  return async function updateBank(balance: number) {
    if (balance == null || balance == undefined || balance < 0) {
      throw Error("Money is null or smaller than 0")
    }
    bankRepo.setBankMoney(balance)
  }
}
