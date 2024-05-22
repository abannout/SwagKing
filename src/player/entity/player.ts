import Money from "../../common/purchasing/money";

export default interface Player{
  playerId: string;
  name: string;
  email: string;
  playerExchange: string;
  money:Money
}