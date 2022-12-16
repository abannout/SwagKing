import { Planet, Resource } from "./types";
import graphviz from "graphviz-wasm";
import fs from "fs/promises";
import * as path from "node:path";

await graphviz.loadWASM();

// For readability
type PlanetId = string;
type RobotId = string;

// This is our basic graph structure
const NODES: Record<PlanetId, Planet> = {};
const EDGES: Record<PlanetId, PlanetId[]> = {};

// We also need to keep track of our robots
const ROBOTS: Record<PlanetId, RobotId[]> = {};

function setPlanet(planet: Planet): void {
  NODES[planet.planet] = planet;
  EDGES[planet.planet] = planet.neighbours.map((n) => n.id);
}

function setRobot(robotId: RobotId, planetId: PlanetId): void {
  console.log("Setting robot", robotId, "on planet", planetId);
  ROBOTS[planetId] = ROBOTS[planetId] || [];
  ROBOTS[planetId].push(robotId);
}

function moveRobot(robotId: RobotId, from: PlanetId, to: PlanetId): void {
  console.log("Moving robot", robotId, "from", from, "to", to);
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

// TODO: Put that somewhere else
async function draw() {
  const resourceIcon: Record<Resource, string> = {
    coal: "🪨",
    gold: "🪙",
    iron: "🧲",
    gem: "💎",
    platin: "🛡️",
  };

  const trimUUID = (uuid: string) => uuid.slice(0, 8);

  const planetNodes = Object.entries(NODES)
    .map(([id, planet]) => {
      let label: string = trimUUID(planet.planet);
      if (planet.resource) {
        label = `${resourceIcon[planet.resource.resource_type]} ${label}`;
        label += `\n${planet.resource.current_amount} / ${planet.resource.max_amount}`;
      }

      return `"${id}" [label="${label}"]`;
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
    ${connections}
  }`;

  const svg = graphviz.layout(dotSrc, "svg", engine);
  const writeSvg = fs.writeFile(path.resolve("logs/map.svg"), svg);
  const writeDot = fs.writeFile(path.resolve("logs/map.dot"), dotSrc);
  await Promise.all([writeSvg, writeDot]);
}

export default {
  setPlanet,
  getPlanet,
  getRandomNeighbour,
  setRobot,
  moveRobot,
  draw,
};