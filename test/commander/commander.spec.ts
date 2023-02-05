import { assert } from "chai";
import { describe, test } from "mocha";
import { fetchCommands } from "../../src/commander/commander";
import { bank } from "../../src/state/state";

describe("The Commander", () => {
  describe("When Money is available", () => {
    bank.put(500);
    test("fetch should have a command", () => {
      assert.isAtLeast(fetchCommands().length, 1);
    });
  });
});
