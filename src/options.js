/* @flow */

import type {ArgV} from "./command";

export type QuickPackOptions = {
  projectRoot: string,
  sourceMap: boolean,
  sourceMapType: string,
  output: string,
  hash: boolean,
  target: Target,

  production: boolean,

  devServerPort: number,
  forwardServer: string,

  isLibrary: boolean,

  useProduction: boolean,
  useWatch: boolean,
  useHotReload: boolean,
  useServer: boolean,
  useUglify: boolean,
};

// Massage the CLI arguments a bit...
export function normalizeQuickPackOptions(argv: ArgV): QuickPackOptions {
  let options: any = Object.assign({},{
    projectRoot: process.cwd(),

    devServerPort: argv.port || process.env.PORT || 8000,

    forwardServer: argv.forward,

    useProduction: argv.production === true || process.env.NODE_ENV == "production",
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
