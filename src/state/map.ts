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

export function setPlanet(planet: Planet): void {
  map.nodes[planet.planet] = planet;
  map.edges[planet.planet] = planet.neighbours.map((n) => n.id);
}

export function getPlanet(id: PlanetId): Planet | undefined {
  return map.nodes[id];
}

export function getRandomNeighbour(id: PlanetId): PlanetId | undefined {
  const neighbours = map.edges[id];
  return neighbours[Math.floor(Math.random() * neighbours.length)];
}

export function areNeighbours(id: PlanetId, neighbourId: PlanetId): boolean {
  return map.edges[id].some((p) => p === neighbourId);
}

export function count() {
  return Object.keys(map.nodes).length;
}

export function countUndiscovered() {
  const undiscoveredPlanets = Object.values(map.edges)
    .flat()
    .filter((id) => map.nodes[id] === undefined);
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
  return Object.values(map.edges)
    .flat()
    .filter((id) => map.nodes[id] === undefined);
}

export function shortestPath(
  source: PlanetId,
  predicate: (p: PlanetId) => boolean
): PlanetId[] | null {
  const possiblePlanets = Object.keys(map.nodes).filter(predicate);
  return shortestPathToOneOf(source, possiblePlanets);
}

const memorizedShortestPaths: Record<string, Record<string, PlanetId[] | null>> = {};
export function shortestPathTo(
  source: PlanetId,
  target: PlanetId
): PlanetId[] | null {
  const memorizedPath = memorizedShortestPaths[source]?.[target];
  if (memorizedPath !== undefined) return memorizedPath;
  const path = shortestPath(source, (p) => p === target);
  memorizedShortestPaths[source] = memorizedShortestPaths[source] || {};
  memorizedShortestPaths[source][target] = path;
  return path;
}

export function shortestPathToOneOf(
  source: PlanetId,
  targets: PlanetId[]
): PlanetId[] | null {
  if (targets.includes(source)) {
    return [];
  }
  const memorizedFromSource = memorizedShortestPaths[source];
  const allMemorizedTargets = Object.keys(memorizedFromSource || {});
  if(allMemorizedTargets.length > 0 && allMemorizedTargets.every(t => targets.includes(t))) {
    // All targets are memorized and the shortest path is known
    return allMemorizedTargets
      .filter(t => targets.includes(t))
      .map(t => memorizedFromSource[t])
      .filter((p): p is PlanetId[] => p !== null)
      .sort((a, b) => a.length - b.length)[0];
  }

  const queue = [source];
  const visited = [source];
  const parents: Record<PlanetId, PlanetId> = {};

  while (queue.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    // rome-ignore lint/style/noNonNullAssertion: <explanation>
    const  elem = queue.shift()!;
    if (targets.includes(elem)) {
      // Found, backtrace parents
      const path = [elem];
      let current = elem;

      while (current !== source) {
        current = parents[current];
        if (current === undefined) throw Error("Should not happen");
        path.push(current);
      }

      path.reverse();
      memorizedShortestPaths[source] = memorizedShortestPaths[source] || {};
      memorizedShortestPaths[source][elem] = path;
      return path;
    }

    const adjacentEdges = map.edges[elem] || [];
    for (const edge of adjacentEdges) {
      if (visited.includes(edge)) continue;
      parents[edge] = elem;
      visited.push(edge);
      queue.push(edge);
    }
  }

  return null;
}

// Helper Methods
export function shortestPathToUnknownPlanet(
  source: PlanetId
): PlanetId[] | null {
  return shortestPathToOneOf(source, undiscoveredPlanets());
}

export function shortestPathToResource(
  source: PlanetId,
  resource: ResourceType,
  predicate: (p: PlanetId) => boolean = () => true
): PlanetId[] | null {
  return shortestPath(
    source,
    (p) =>
      map.nodes[p]?.resource?.resourceType === resource &&
      map.nodes[p]?.resource?.currentAmount > 0 &&
      predicate(p)
  );
}
