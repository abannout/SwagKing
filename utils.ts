export function until(
  condition: () => boolean,
  timeout: number = 500
): Promise<void> {
  const poll = (resolve: any) => {
    if (condition()) resolve();
    else setTimeout(() => poll(resolve), timeout);
  };

  return new Promise(poll);
}

export function untilAsync(
  condition: () => Promise<boolean>,
  timeout: number = 500
): Promise<void> {
  const poll = async (resolve: any) => {
    if (await condition()) resolve();
    else setTimeout(() => poll(resolve), timeout);
  };

  return new Promise(poll);
}
