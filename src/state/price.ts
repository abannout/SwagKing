import { Tradable } from "../types";

let prices: Partial<Record<Tradable, number>>;

function set(newPrices: Partial<Record<Tradable, number>>) {
  prices = newPrices;
}

function clear() {
  prices = {};
}

export default {
  set,
  clear
}