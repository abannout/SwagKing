const balance = {
  credit: 0,
  debit: 0,
};

export function init(newBalance: number) {
  balance.credit = newBalance;
  balance.debit = 0;
}

export function put(amount: number) {
  if (amount === 0) return;
  if (amount < 0) {
    addDebit(-amount);
  } else {
    addCredit(amount);
  }
}

export function check(amount: number) {
  return get() === amount;
}

export function get(): number {
  return balance.credit - balance.debit;
}

function addCredit(amount: number) {
  balance.credit += amount;
}

function addDebit(amount: number) {
  balance.debit += amount;
}

export function clear() {
  init(0);
}
