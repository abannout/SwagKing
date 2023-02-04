import { assert } from "chai";
import { describe, test } from "mocha";
import map from "../../src/state/map";

describe("A Map", () => {
  test("should return 0 discovered planets when empty", () => {
    assert.equal(map.count(), 0);
  });
  it("should return 0 undiscovered planets when empty", () => {
    assert.equal(map.countUndiscovered(), 0);
  });
});
