import * as fs from "fs";
import * as fsp from "fs/promises";
import * as path from "node:path";
import pino, { StreamEntry } from "pino";
import { config } from "../config.js";

const logDirectory = config.logging.dir || "logs";
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
    level: config.logging.level,
  },
  pino.multistream(streams)
);

export async function writeToFile(file: string, content: string) {
  fsp.writeFile(path.resolve(logPath, file), content);
}

export default logger;
