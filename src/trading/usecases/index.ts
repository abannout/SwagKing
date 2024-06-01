import { makeInitializeBank } from "./initialize-bank.js";
import bankDataSource from "../data-access/bank-db.js";
import { makeBuyRobots } from "./buy-robot.js";
import { makeUpdateBank } from "./update-bank.js";
import { handleSellResources } from "./sell-resources.js";
import robotDataSource from "../../robot/data-access/robot-db.js";

const initializeBank = makeInitializeBank({ bankRepo: bankDataSource() });
const buyRobots = makeBuyRobots({ bankRepo: bankDataSource() });
const updateBankBalance = makeUpdateBank({ bankRepo: bankDataSource() });
const sellResources = handleSellResources({ robotRepo: robotDataSource() });
export const setupBank = () => {
  initializeBank();
  buyRobots();
  updateBankBalance();
  sellResources();
};
