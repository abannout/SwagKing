import { Tradable, UpgradeType } from "../types";

export function until(condition: () => boolean, timeout = 500): Promise<void> {
  const poll = (resolve: (value: void | PromiseLike<void>) => void) => {
    if (condition()) resolve();
    else setTimeout(() => poll(resolve), timeout);
  };

  return new Promise(poll);
}

export function untilAsync(
  condition: () => Promise<boolean>,
  timeout = 500
): Promise<void> {
  const poll = async (resolve: (value: void | PromiseLike<void>) => void) => {
    if (await condition()) resolve();
    else setTimeout(() => poll(resolve), timeout);
  };

  return new Promise(poll);
}

export function getUpgrade(
  upgrade: UpgradeType,
  currentLevel: number
): Tradable {
  if (currentLevel >= 5) throw new Error(`Max level reached for ${upgrade}`);
  return `${upgrade}_${currentLevel + 1}` as Tradable;
}
