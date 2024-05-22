import * as relay from "../net/relay.js";
import Player from "../player/entity/player.js";
import logger from "../utils/logger.js";
let player:Player ={
    playerId:"",
    name:"",
    email:"",
money: { amount: 0 },
playerExchange:"",
}

export function bankAccountInitialized() {
  relay.on("BankAccountInitialized", (event, context) => {
    const { payload } = event;
    player.money={amount:payload.balance}
      logger.info(`Bank has been initallized with balance: ${payload.balance}`)
  });
}
