import bankDataSource from "../data-access/bank-db.js";
import makeAddBank from "./add-bank.js";
import makegetBank from "./get-bank.js";
import makeUpdateBankBalance from "./update-bank.js";

const addBank = makeAddBank({ bankRepo: bankDataSource() });
const getBank = makegetBank({ bankRepo: bankDataSource() });
const updateBankBalance = makeUpdateBankBalance({ bankRepo: bankDataSource() });

const bankService = Object.freeze({
  addBank,
  getBank,
  updateBankBalance,
});

export default bankService;
export { addBank, getBank, updateBankBalance };
