import { Planet, ResourceType } from "../types";

// For readability
type PlanetId = string;

export type Map = {
  nodes: Record<PlanetId, Planet>;
  edges: Record<PlanetId, PlanetId[]>;
};

const map: Map = {
  nodes: {},
  edges: {},
};

const NODES = map.nodes;
const EDGES = map.edges;

export function setPlanet(planet: Planet): void {
  NODES[planet.planet] = planet;
  EDGES[planet.planet] = planet.neighbours.map((n) => n.id);
}

export function getPlanet(id: PlanetId): Planet | undefined {
  return NODES[id];
}

export function getRandomNeighbour(id: PlanetId): PlanetId | undefined {
  const neighbours = EDGES[id];
  return neighbours[Math.floor(Math.random() * neighbours.length)];
}

export function areNeighbours(id: PlanetId, neighbourId: PlanetId): boolean {
  return EDGES[id].some((p) => p === neighbourId);
}

export function count() {
  return Object.keys(NODES).length;
}

export function countUndiscovered() {
  const undiscoveredPlanets = Object.values(EDGES)
    .flat()
    .filter((id) => NODES[id] === undefined);
  return undiscoveredPlanets.length;
}

export function getMap(): Map {
  return map;
}

export function clear() {
  map.edges = {};
  map.nodes = {};
}

export function undiscoveredPlanets(): PlanetId[] {
  return Object.keys(EDGES).filter((e) => NODES[e] === undefined);
}

export function shortestPath(
  source: PlanetId,
  predicate: (p: PlanetId) => boolean
): PlanetId[] | null {
  if (predicate(source)) {
    return [];
  }

  const queue = [source];
  const visited = [source];
  const parents: Record<PlanetId, PlanetId> = {};

  while (queue.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const elem = queue.shift()!;
    if (predicate(elem)) {
      // Found, backtrace parents
      const path = [elem];
      let current = elem;

      while (current !== source) {
        current = parents[current];
        if (current === undefined) throw Error("Should not happen");
        path.push(current);
      }

      path.reverse();
      return path;
    }

    const adjacentEdges = EDGES[elem] || [];
    for (const edge of adjacentEdges) {
      if (visited.includes(edge)) continue;
      parents[edge] = elem;
      visited.push(edge);
      queue.push(edge);
    }
  }

  return null;
}

export function shortestPathTo(
  source: PlanetId,
  target: PlanetId
): PlanetId[] | null {
  return shortestPath(source, (p) => p === target);
}

// Helper Methods
export function shortestPathToUnknownPlanet(
  source: PlanetId
): PlanetId[] | null {
  return shortestPath(source, (p) => NODES[p] === undefined);
}

export function shortestPathToResource(
  source: PlanetId,
  resource: ResourceType
): PlanetId[] | null {
  return shortestPath(
    source,
    (p) =>
      NODES[p]?.resource?.resourceType === resource &&
      NODES[p]?.resource?.currentAmount > 0
  );
}
