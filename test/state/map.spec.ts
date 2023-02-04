import map from "../../src/state/map";

describe("A Map", () => {
  it("should return 0 discovered planets when empty", () => {
    expect(map.count()).toBe(0);
  });
  it("should return 0 undiscovered planets when empty", () => {
    expect(map.countUndiscovered()).toBe(0);
  });
});
