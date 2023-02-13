import fs from "fs/promises";
import graphviz from "graphviz-wasm";
import * as path from "node:path";
import * as relay from "../net/relay.js";
import { Map } from "../state/map.js";
import { fleet, map, radar } from "../state/state.js";
import { ResourceType } from "../types.js";

await graphviz.loadWASM();

const resourceIcon: Record<ResourceType, string> = {
  COAL: "🪨",
  GOLD: "🪙",
  IRON: "🧲",
  GEM: "💎",
  PLATIN: "🛡️",
};
const engine = "fdp";

const trimUUID = (uuid: string) => uuid.slice(0, 8);
const removeIdentation = (s: string) => s.replace(/^ {4}/gm, "");

export async function drawMap(map: Map) {
  const planetNodes = Object.entries(map.nodes)
    .map(([id, planet]) => {
      const dotId = trimUUID(id);
      let label = dotId;
      if (planet.resource) {
        label = `${resourceIcon[planet.resource.resourceType]} ${label}`;
        label += `\n${planet.resource.currentAmount} / ${planet.resource.maxAmount}`;
      }

      const locatedRobots = fleet.getRobotsOnPlanet(id);
      let shape = "circle";
      let color = "white";
      if (locatedRobots.length > 0) {
        shape = "doublecircle";
        color = "green";
      }
      const spottedRobots = radar.getOnPlanet(id);
      if (spottedRobots.length > 0) {
        color = "red";
      }

      return `"${dotId}" [label="${label}" shape="${shape}" color="${color}"]`;
    })
    .join(";\n");

  const undiscoveredPlanets = Object.values(map.edges)
    .flat()
    .filter((id) => map.nodes[id] === undefined)
    .map((id) => {
      const dotId = trimUUID(id);
      return `"${dotId}" [color="yellow"]`;
    })
    .join(";\n");

  const connections = Object.entries(map.edges)
    .map(([id, neighbours]) => {
      const dotId = trimUUID(id);
      return neighbours
        .map((neighbour) => `"${dotId}" -- "${trimUUID(neighbour)}"`)
        .join(";\n");
    })
    .join(";\n");

  const dotSrc = removeIdentation(`
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
  }`);

  const svg = graphviz.layout(dotSrc, "svg", engine);
  const writeSvg = fs.writeFile(path.resolve("logs/map.svg"), svg);
  const writeDot = fs.writeFile(path.resolve("logs/map.dot"), dotSrc);
  await Promise.all([writeSvg, writeDot]);
}

export function setupVisualization() {
  relay.on("round-status", async (event) => {
    const { payload } = event;
    if (payload.roundStatus === "ended") {
      await drawMap(map.getMap());
    }
  });
}
