import { handleInitializeBank } from "./interactors/initialize-bank.js";
import { handleUpdateBank } from "./interactors/update-bank.js";

const handleInitializeBankEvent = handleInitializeBank();
const handleBankEvent = handleUpdateBank();

export const handleEventsForBank = () => {
  handleInitializeBankEvent();
  handleBankEvent();
};
