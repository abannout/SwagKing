const balance = {
  credit: 0,
  debit: 0
}

function init(newBalance: number) {
  balance.credit = newBalance;
  balance.debit = 0;
}

function put(amount: number) {
  if (amount === 0) return;
  if (amount < 0) {
    addDebit(-amount);
  } else {
    addCredit(amount);
  }
}

function check(amount: number) {
  return get() === amount;
}

function get(): number {
  return balance.credit - balance.debit;
}

function addCredit(amount: number) {
  balance.credit += amount;
}

function addDebit(amount: number) {
  balance.debit += amount;
}

function clear() {
  init(0);
}

export default {
  init,
  put,
  check,
  get,
  clear
}