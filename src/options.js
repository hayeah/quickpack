/* @flow */

export type QuickPackOptions = {
  projectRoot: string,
  sourceMap: boolean,
  sourceMapType: string,
  output: string,
  hash: boolean,
  target: Target,

  production: boolean,

  devServerPort: number,

  useProduction: boolean,
  useWatch: boolean,
  useHotReload: boolean,
  useServer: boolean,
  useUglify: boolean,
};

// massage the CLI arguments a bit...
// FIXME: The flow type is checking, but type-at-pos doesn't work
export function normalizeQuickPackOptions(argv:any): QuickPackOptions {
  // var production = argv.production === true || process.env.NODE_ENV == "production";

  let options: QuickPackOptions = Object.assign({},{
    projectRoot: process.cwd(),

    devServerPort: argv.port || process.env.PORT || 8000,

    useProduction: argv.production === true || process.env.NODE_ENV == "production",
    useServer: argv.live === true,
    useHotReload: argv.live === true,
    useWatch: argv.watch === true,
    useUglify: argv.uglify === true,
  },argv);

  return options;
}

export default normalizeQuickPackOptions;

export type Target = "web" | "node";

export type WebpackConfig = any;
