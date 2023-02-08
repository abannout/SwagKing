import { assert } from "chai";
import { describe, test } from "mocha";
import { bank } from "../../src/state/state.js";

describe("The Bank", () => {
  beforeEach(() => bank.clear());

  test("should be initialized with 0", () => {
    assert.equal(bank.get(), 0);
  });

  test("should be initializable with amount", () => {
    bank.init(200);
    assert.equal(bank.get(), 200);
  });

  test("should credit money", () => {
    bank.put(100);
    assert.equal(bank.get(), 100);
  });

  test("should debit money", () => {
    bank.put(-100);
    assert.equal(bank.get(), -100);
  });

  [100, 0, -100].forEach((amount) =>
    test("should check correctly", () => {
      bank.init(amount);
      assert.isTrue(bank.check(amount));
    })
  );
});
