import { Tradable } from "../types";

// TODO: Get rid of hardcoded prices. these are only necessary for the first command...
let prices: Partial<Record<Tradable, number>> = {
  COAL: 5,
  DAMAGE_1: 50,
  DAMAGE_2: 300,
  DAMAGE_3: 1500,
  DAMAGE_4: 4000,
  DAMAGE_5: 15000,
  ENERGY_REGEN_1: 50,
  ENERGY_REGEN_2: 300,
  ENERGY_REGEN_3: 1500,
  ENERGY_REGEN_4: 4000,
  ENERGY_REGEN_5: 15000,
  ENERGY_RESTORE: 75,
  GEM: 30,
  GOLD: 50,
  HEALTH_1: 50,
  HEALTH_2: 300,
  HEALTH_3: 1500,
  HEALTH_4: 4000,
  HEALTH_5: 15000,
  HEALTH_RESTORE: 50,
  IRON: 15,
  MAX_ENERGY_1: 50,
  MAX_ENERGY_2: 300,
  MAX_ENERGY_3: 1500,
  MAX_ENERGY_4: 4000,
  MAX_ENERGY_5: 15000,
  MINING_1: 50,
  MINING_2: 300,
  MINING_3: 1500,
  MINING_4: 4000,
  MINING_5: 15000,
  MINING_SPEED_1: 50,
  MINING_SPEED_2: 300,
  MINING_SPEED_3: 1500,
  MINING_SPEED_4: 4000,
  MINING_SPEED_5: 15000,
  PLATIN: 60,
  ROBOT: 100,
  STORAGE_1: 50,
  STORAGE_2: 300,
  STORAGE_3: 1500,
  STORAGE_4: 4000,
  STORAGE_5: 15000,
};

export function set(newPrices: Partial<Record<Tradable, number>>) {
  prices = newPrices;
}

export function get(name: Tradable): number | undefined {
  return prices[name];
}

export function clear() {
  prices = {};
}
