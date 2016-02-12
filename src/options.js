/* @flow */

import type {ArgV} from "./command";

export type QuickPackOptions = {
  projectRoot: string,
  sourceMap: boolean,
  sourceMapCheap: boolean,
  sourceMapType: string,
  output: string,
  hash: boolean,
  target: Target,

  production: boolean,

  devServerPort: number,
  forwardServer: string,

  isLibrary: boolean,

  useES6: boolean,

  useProduction: boolean,
  useWatch: boolean,
  useHotReload: boolean,
  useServer: boolean,
  useUglify: boolean,
};

// Massage the CLI arguments a bit...
export function normalizeQuickPackOptions(argv: ArgV): QuickPackOptions {
  const useProduction = argv.production === true || process.env.NODE_ENV == "production";

  if(process.env.NODE_ENV === undefined) {
    if(useProduction) {
      process.env.NODE_ENV = "production";
    } else {
      process.env.NODE_ENV = "development";
    }
  }

  let useES6;

  if(argv.es6 === undefined) {
    // default to es6 output for development;
    useES6 = !useProduction;
  } else {
    // coerce to boolean
    useES6 = !!argv.es6;
  }

  let options: any = Object.assign({},{
    projectRoot: process.cwd(),

    devServerPort: argv.port || process.env.PORT || 8000,

    forwardServer: argv.forward,

    useES6,

    useProduction,
    useServer: argv.server === true,
    useHotReload: argv.server === true,
    useWatch: argv.watch === true || argv.server === true,
    useUglify: argv.uglify === true,
  }, argv);

  return options;
}

export default normalizeQuickPackOptions;

export type Target = "web" | "node";

export type WebpackConfig = any;
