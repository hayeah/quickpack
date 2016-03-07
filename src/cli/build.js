/* @flow */

import type { QuickPackOptions } from "../options";
import * as options from "./options";

export type ArgV = {
  watch: boolean,
  server: boolean,
  uglify: boolean,

  production: boolean,
  forward: string,
  es6: boolean,

  sourceMap: boolean,
  sourceMapCheap: boolean,

  polyfill: boolean,

  target?: string,

  _: Array<string>,
}

const buildOptions = {
  w: {
    alias: 'watch',
    describe: "Watch mode",
    default: false,
    type: 'boolean',
  },

  server: {
    describe: "Enable server mode",
    type: 'boolean',
    default: false,
  },

  port: {
    describe: "dev-server port",
    type: 'number',
    default: undefined,
  },

  forward: {
    alias: 'f',
    describe: 'forward to backend server',
    default: undefined,
    type: 'string',
  }
};

export function builder(yargs: any): void {
  return yargs
    .usage('$0 build page1=./entry1 page2=./entry2 ...')
    .options(buildOptions)
    .options(options.webpack)
    .example("$0 build entry.js", "Build entry.js")
    .example("$0 build entry1.js entry1.js", "Build multiple entries")
    .example("$0 build page2=./entry1.js page2=./entry2.js ", "Multiple entries with output names")
    .example("$0 build server@node", "Build for NodeJS")
    .example("$0 build client@web server@node", "Build for different targets")
    .example("$0 build index.js --server", "Start live-reload server")
    .help("h").alias("h","help")
    .wrap(yargs.terminalWidth())
  ;
}

export function handler(argv: ArgV): void {
  // $FlowOK
  require("./build/handler")(argv);
}
