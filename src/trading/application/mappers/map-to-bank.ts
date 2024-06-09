import Bank from "../../entity/bank";
import { BankAccountInitializedEvent, GameEvent } from "../../../common/types";

export default function mapToBank(
  event: GameEvent<BankAccountInitializedEvent>
): Bank | undefined {
  if (!event.payload) {
    return undefined;
  }
  return {
    playerId: event.payload.playerId,
    money: {
      amount: event.payload.balance,
    },
  };
}
