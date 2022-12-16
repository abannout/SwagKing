import { Planet, Resource } from "./types";
import graphviz from "graphviz-wasm";
import fs from "fs/promises";
import * as path from "node:path";

await graphviz.loadWASM();

const NODES: Record<string, Planet> = {};
const EDGES: Record<string, string[]> = {};

function set(planet: Planet): void {
  NODES[planet.planet] = planet;
  EDGES[planet.planet] = planet.neighbours.map((n) => n.id);
}

function get(id: string): Planet | undefined {
  return NODES[id];
}

function getRandomNeighbour(id: string): string | undefined {
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
  set,
  get,
  getRandomNeighbour,
  draw,
};