import { Planet } from "./types";

const planets: Record<string, Planet | undefined> = {};

function set(planet: Planet): void {
  planets[planet.planet] = planet;
}

function get(id: string): Planet | undefined {
  return planets[id];
}

export default {
  set,
  get,
};
