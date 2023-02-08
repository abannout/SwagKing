import { assert } from "chai";
import { describe, test } from "mocha";
import { fetchCommands } from "../../src/commander/commander.js";
import { bank } from "../../src/state/state.js";

describe("The Commander", () => {
  describe("When Money is available", () => {
    bank.put(500);
    test("fetch should have a command", () => {
      assert.isAtLeast(fetchCommands().length, 1);
    });
  });
});
