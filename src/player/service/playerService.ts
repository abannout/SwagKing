import { buyRobots } from "../../commands.js";
import Money from "../../common/purchasing/money.js";
import * as relay from "../../net/relay.js";
import logger from "../../utils/logger.js";
import Player from "../entity/player.js";
import PlayerRepository from "../repo/playerRepo.js";

export default class PlayerService{
    // private playerRepository: PlayerRepository;

    // constructor(playerRepository: PlayerRepository) {
    //   this.playerRepository = playerRepository;
    // }
  
  
    public async buyRobots(player:Player,amount:number): Promise<void> {
        if(!buyRobots(amount)){
            throw new Error("cant buy robots!!")
        }
        logger.info("EVENT===> "+amount + " Robots have been bought!!")
    //   this.playerRepository.savePlayer(player)
    }

    private enough
}

// export function setupStateHandlers() {
//   relay.on("BankAccountInitialized", (event, context) => {
//     const { payload } = event;

//     if (payload. === "started") {
//       logger.info(`The ${payload.roundNumber}.Round Started ==>`)
//       game.set(payload.roundNumber, payload.roundId);
//     }
    
//   });
// }
