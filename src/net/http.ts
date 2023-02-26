import * as http from "http";
import { config } from "../config.js";
import { drawMap } from "../dev/visualization.js";
import { fleet, map, radar } from "../state/state.js";

const host = "localhost";
const port = config.net.http.port;

export function setupHttpServer() {
  const server = http.createServer(async (req, res) => {
    switch (req.url) {
      case "/":
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("Hello World");
        break;
      case "/fleet":
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(fleet.getAll(), null, 2));
        break;
      case "/map":
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(map.getMap(), null, 2));
        break;
      case "/map.svg":
        // eslint-disable-next-line no-case-declarations
        const [, svg] = await drawMap(map.getMap());
        res.writeHead(200, { "Content-Type": "image/svg+xml" });
        res.end(svg);
        break;
      case "/map.dot":
        // eslint-disable-next-line no-case-declarations
        const [dot] = await drawMap(map.getMap());
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end(dot);
        break;
      case "/radar":
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(radar.getAll(), null, 2));
        break;
    }
  });
  server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
  });
}
