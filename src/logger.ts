import pino, { StreamEntry } from "pino";
import * as util from "util";
import * as fs from "fs";
import * as path from "node:path";
import context from "./context";

const streams: StreamEntry[] = [
  { level: "info", stream: process.stdout },
  {
    level: "debug",
    stream: fs.createWriteStream(path.resolve("logs/logs.log"), {
      flags: "a",
    }),
  },
];

const formatObj = (obj: unknown) =>
  util.inspect(obj, {
    showHidden: false,
    depth: null,
    showProxy: false,
    colors: true,
  });

const logger = pino(
  {
    level: context.env.mode === "development" ? "debug" : "info",
  },
  pino.multistream(streams)
);

export default logger;
