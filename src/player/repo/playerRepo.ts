import Player from "../entity/player";

export default interface PlayerRepository {
    getPlayerbyName(name: string): Promise<Player>;
    setPlayerBankMoney(money: number): Promise<Player>;
    savePlayer(player:Player):Promise<void>;
}