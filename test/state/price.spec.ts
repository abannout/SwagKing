import { assert } from "chai";
import { describe, test } from "mocha";
import { price } from "../../src/state/state.js";

describe("Prices", () => {
  beforeEach(() => price.clear());

  test("should return correct price", () => {
    price.set({ ROBOT: 200 });
    assert.equal(price.get("ROBOT"), 200);
  });

  test("should return undefined for unknown price", () => {
    assert.isUndefined(price.get("ROBOT"));
  });
});
