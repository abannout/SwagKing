import Bank from "../entity/bank"

export default interface BankRepository {
  getBank(): Promise<Bank>
  setBankMoney(money: number): Promise<void>
  saveBank(bank: Bank): Promise<void>
}
