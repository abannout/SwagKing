import { assert } from "chai";
import { describe, test } from "mocha";
import * as map from "../../src/state/map.js";
import { Planet } from "../../src/types";

describe("A Map", () => {
  describe("filled with planets", () => {
    const planets: Planet[] = [
      {
        planet: "1",
        movementDifficulty: 1,
        neighbours: [{ id: "2" }],
        resource: null,
      },
      {
        planet: "2",
        movementDifficulty: 1,
        neighbours: [{ id: "1" }, { id: "3" }, { id: "4" }],
        resource: null,
      },
      {
        planet: "3",
        movementDifficulty: 1,
        neighbours: [{ id: "2" }, { id: "4" }],
        resource: null,
      },
      {
        planet: "4",
        movementDifficulty: 1,
        neighbours: [{ id: "3" }, { id: "5" }],
        resource: null,
      },
      {
        planet: "5",
        movementDifficulty: 1,
        neighbours: [{ id: "2" }, { id: "4" }, { id: "6" }, { id: "8" }],
        resource: null,
      },
      {
        planet: "6",
        movementDifficulty: 1,
        neighbours: [{ id: "5" }, { id: "7" }],
        resource: null,
      },
      {
        planet: "7",
        movementDifficulty: 1,
        neighbours: [{ id: "6" }, { id: "8" }],
        resource: null,
      },
      {
        planet: "8",
        movementDifficulty: 1,
        neighbours: [{ id: "7" }, { id: "5" }, { id: "9" }],
        resource: null,
      },
      {
        planet: "9",
        movementDifficulty: 1,
        neighbours: [{ id: "8" }],
        resource: null,
      },
    ];
    planets.forEach((p) => map.setPlanet(p));

    test("#shortestPath", () => {
      assert.deepEqual(
        map.shortestPath("1", (p) => p === "9"),
        ["1", "2", "4", "5", "8", "9"]
      );
    });
  });
});
