import fs from "fs/promises";
import graphviz from "graphviz-wasm";
import * as path from "node:path";
import { Map } from "../state/map";
import { ResourceType } from "../types";

await graphviz.loadWASM();

export async function drawMap(map: Map) {
  const resourceIcon: Record<ResourceType, string> = {
    COAL: "🪨",
    GOLD: "🪙",
    IRON: "🧲",
    GEM: "💎",
    PLATIN: "🛡️",
  };

  const trimUUID = (uuid: string) => uuid.slice(0, 8);

  const planetNodes = Object.entries(map.nodes)
    .map(([id, planet]) => {
      let label: string = trimUUID(planet.planet);
      if (planet.resource) {
        label = `${resourceIcon[planet.resource.resourceType]} ${label}`;
        label += `\n${planet.resource.currentAmount} / ${planet.resource.maxAmount}`;
      }

      return `"${id}" [label="${label}"]`;
    })
    .join(";\n");

  const undiscoveredPlanets = Object.values(map.edges)
    .flat()
    .filter((id) => map.nodes[id] === undefined)
    .map((id) => {
      const label: string = trimUUID(id);

      return `"${id}" [label="${label}" color="red"]`;
    })
    .join(";\n");

  const connections = Object.entries(map.edges)
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
