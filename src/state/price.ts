import { Tradable } from "../types";

let prices: Partial<Record<Tradable, number>>;

function set(newPrices: Partial<Record<Tradable, number>>) {
  prices = newPrices;
}

export default {
  set
}