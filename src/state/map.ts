import fs from "fs/promises";
import graphviz from "graphviz-wasm";
import * as path from "node:path";
import { Planet, ResourceType } from "../types";
import logger from "../utils/logger";

await graphviz.loadWASM();

// For readability
type PlanetId = string;
type RobotId = string;

// This is our basic graph structure
let NODES: Record<PlanetId, Planet> = {};
let EDGES: Record<PlanetId, PlanetId[]> = {};

// We also need to keep track of our robots
let ROBOTS: Record<PlanetId, RobotId[]> = {};

function setPlanet(planet: Planet): void {
  NODES[planet.planet] = planet;
  EDGES[planet.planet] = planet.neighbours.map((n) => n.id);
}

function setRobot(robotId: RobotId, planetId: PlanetId): void {
  logger.debug("Setting robot", robotId, "on planet", planetId);
  ROBOTS[planetId] = ROBOTS[planetId] || [];
  ROBOTS[planetId].push(robotId);
}

function moveRobot(robotId: RobotId, from: PlanetId, to: PlanetId): void {
  logger.debug("Moving robot", robotId, "from", from, "to", to);
  ROBOTS[from] = ROBOTS[from].filter((id) => id !== robotId);
  setRobot(robotId, to);
}

function getPlanet(id: PlanetId): Planet | undefined {
  return NODES[id];
}

function getRandomNeighbour(id: PlanetId): PlanetId | undefined {
  const neighbours = EDGES[id];
  return neighbours[Math.floor(Math.random() * neighbours.length)];
}

function areNeighbours(id: PlanetId, neighbourId: PlanetId): boolean {
  return EDGES[id].some((p) => p === neighbourId);
}

function count() {
  return Object.keys(NODES).length;
}

function countUndiscovered() {
  const undiscoveredPlanets = Object.values(EDGES)
    .flat()
    .filter((id) => NODES[id] === undefined);
  return undiscoveredPlanets.length;
}

// TODO: Put that somewhere else
async function draw() {
  const resourceIcon: Record<ResourceType, string> = {
    COAL: "🪨",
    GOLD: "🪙",
    IRON: "🧲",
    GEM: "💎",
    PLATIN: "🛡️",
  };

  const trimUUID = (uuid: string) => uuid.slice(0, 8);

  const planetNodes = Object.entries(NODES)
    .map(([id, planet]) => {
      let label: string = trimUUID(planet.planet);
      if (planet.resource) {
        label = `${resourceIcon[planet.resource.resourceType]} ${label}`;
        label += `\n${planet.resource.currentAmount} / ${planet.resource.maxAmount}`;
      }

      return `"${id}" [label="${label}"]`;
    })
    .join(";\n");

  const undiscoveredPlanets = Object.values(EDGES)
    .flat()
    .filter((id) => NODES[id] === undefined)
    .map((id) => {
      const label: string = trimUUID(id);

      return `"${id}" [label="${label}" color="red"]`;
    })
    .join(";\n");

  const connections = Object.entries(EDGES)
    .map(([id, neighbours]) => {
      return neighbours
        .map((neighbour) => `"${id}" -- "${neighbour}"`)
        .join(";\n");
    })
    .join(";\n");
  const engine = "neato";

  const dotSrc = `
  graph {
    layout = ${engine};

    bgcolor="#36393f";
    fontcolor="#ffffff";
    fontname="Monospace"
    node [
      color="#ffffff"
      fontcolor="#ffffff",
      labelfontcolor="#ffffff",
      shape=box,
    ];
    edge [
      color="#ffffff"
      fontcolor="#ffffff",
      labelfontcolor="#ffffff",
    ];

    ${planetNodes}
    ${undiscoveredPlanets}
    ${connections}
  }`;

  const svg = graphviz.layout(dotSrc, "svg", engine);
  const writeSvg = fs.writeFile(path.resolve("logs/map.svg"), svg);
  const writeDot = fs.writeFile(path.resolve("logs/map.dot"), dotSrc);
  await Promise.all([writeSvg, writeDot]);
}

function clear() {
  NODES = {};
  EDGES = {};
  ROBOTS = {};
}

function undiscoveredPlanets(): PlanetId[] {
  return Object.keys(EDGES).filter((e) => NODES[e] === undefined);
}

function shortestPath(
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
      path.splice(0, 1);

      console.log(`Source: ${source}, Path: ${path}`);
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

function shortestPathTo(source: PlanetId, target: PlanetId): PlanetId[] | null {
  return shortestPath(source, (p) => p === target);
}

// Helper Methods
function shortestPathToUnknownPlanet(source: PlanetId): PlanetId[] | null {
  return shortestPath(source, (p) => NODES[p] === undefined);
}

function shortestPathToResource(
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

function getRobotsOnPlanet(planet: PlanetId): RobotId[] {
  return ROBOTS[planet] || [];
}

export default {
  setPlanet,
  getPlanet,
  getRandomNeighbour,
  getRobotsOnPlanet,
  setRobot,
  moveRobot,
  draw,
  clear,
  shortestPathToUnknownPlanet,
  shortestPathToResource,
  shortestPathTo,
  areNeighbours,
  count,
  countUndiscovered,
};
