import { Planet } from "./types";

const NODES: Record<string, Planet> = {};
const EDGES: Record<string, string[]> = {};

function set(planet: Planet): void {
  NODES[planet.planet] = planet;
  EDGES[planet.planet] = planet.neighbours.map((n) => n.id);
}

function get(id: string): Planet | undefined {
  return NODES[id];
}

export default {
  set,
  get,
};
