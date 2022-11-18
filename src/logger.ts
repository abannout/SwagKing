import * as util from "util";

const formatObj = (obj: unknown) =>
  util.inspect(obj, {
    showHidden: false,
    depth: null,
    showProxy: false,
    colors: true,
  });

const logger = {
  info: (message: unknown) => console.log(formatObj(message)),
  debug: (message: unknown) => console.debug(formatObj(message)),
  error: (message: unknown) => console.error(formatObj(message)),
};

export default logger;
