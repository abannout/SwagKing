import { Tradable } from "../types";

let prices: Partial<Record<Tradable, number>>;

export function set(newPrices: Partial<Record<Tradable, number>>) {
  prices = newPrices;
}

export function get(name: Tradable): number | undefined {
  return prices[name];
}

export function clear() {
  prices = {};
}
