import { Tradable } from "../types";

let prices: Partial<Record<Tradable, number>>;

function set(newPrices: Partial<Record<Tradable, number>>) {
  prices = newPrices;
}

function get(name: Tradable): number | undefined {
  return prices[name];
}

function clear() {
  prices = {};
}

export default {
  set,
  clear,
  get,
};
