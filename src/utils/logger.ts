import * as fs from "fs";
import * as path from "node:path";
import pino, { StreamEntry } from "pino";

const logDirectory = "logs";
const logPath = path.resolve(logDirectory);

if (!fs.existsSync(logPath)) {
  fs.mkdirSync(logPath);
}

const streams: StreamEntry[] = [
  {
    level: "info",
    stream: process.stdout,
  },
  {
    level: "debug",
    stream: fs.createWriteStream(path.resolve(logPath, "logs.log"), {
      flags: "a",
    }),
  },
];

const logger = pino(
  {
    level: "debug",
  },
  pino.multistream(streams)
);

export default logger;
