import { assert } from "chai";
import { describe, test } from "mocha";
import { fetchCommands, notify } from "../../src/commander/commander";

describe("The Commander", () => {
  describe("When notified about game start", () => {
    beforeEach(() =>
      notify({
        type: "game",
        status: "started",
      })
    );

    test("fetch should have a command", () => {
      assert.isAtLeast(fetchCommands().length, 1);
    });

    test("fetch should clear commands", () => {
      const commands = fetchCommands();
      assert.isEmpty(fetchCommands());
    });
  });
});
