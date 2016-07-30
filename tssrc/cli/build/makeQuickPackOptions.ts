/* @flow */

import { QuickPackOptions } from "../../options";
import { ArgV } from "../build";

// Massage the CLI arguments a bit...
export function makeQuickPackOptions(target: string, argv: ArgV): QuickPackOptions {
  const useProduction = argv.production === true || process.env.NODE_ENV == "production";

  if(process.env.NODE_ENV === undefined) {
    if(useProduction) {
      process.env.NODE_ENV = "production";
    } else {
      process.env.NODE_ENV = "development";
    }
  }

  let useES6 = argv.es6;
  if(useES6 === undefined) {
    // default to es6 output for NodeJS and developmtn mode;
    useES6 = target === "node" || !useProduction;
  }

  let usePolyfill = argv.polyfill;
  if(usePolyfill === undefined) {
    usePolyfill = target === "web" && !useES6;
  }


  let options: any = Object.assign({},{
    projectRoot: process.cwd(),

    devServerPort: argv.port || process.env.PORT || 8000,

    forwardServer: argv.forward,

    defaultTarget: argv.target || "web",

    useES6,
    usePolyfill,

    useProduction,
    useServer: argv.server === true,
    useHotReload: argv.server === true,
    useWatch: argv.watch === true || argv.server === true,
    useUglify: argv.uglify === true,
  }, argv);

  return options;
}
