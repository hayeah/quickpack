/* @flow */

import webpack from "webpack";

import type { QuickPackOptions } from "../options";

import { makeQuickPackOptions } from "./build/makeQuickPackOptions";

import detectPort from "detect-port";

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


function report(err,stats) {
  if(err) {
    console.error(err.stack || err);
    if(err.details) console.error(err.details);
    return;
  }

  process.stdout.write(stats.toString("normal"));

  // const json = stats.toJson();
  // console.log(JSON.stringify(json.chunks, null, 2));
  // console.log(JSON.stringify(json.assetsByChunkName, null, 2));
  // console.log(JSON.stringify(json.assets, null, 2));
}

import type { Target } from "../config";
import {buildConfig} from "../config";
import {extractEntriesFromArguments} from "../processEntries";

import startDevServer from "../startDevServer";

import * as options from "./options";

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
  const items = argv._.slice(1);

  const defaultTarget = argv.target || "web";

  // sort arguments into different targets
  const compilations = extractEntriesFromArguments(items, defaultTarget);


  if(argv.server) {
    const options = makeQuickPackOptions("web", argv);
    const web = compilations.web;
    if(web !== undefined) {
      delete compilations.web;
      detectPort(options.devServerPort,(err,port) => {
        if(err) {
          console.log(err);
          process.exit(1);
        }

        options.devServerPort = port;

        const config = buildConfig("web", web, options);
        startDevServer(config, options);
      });

    }
  }

  const configs = Object.keys(compilations).map(target => {
    const options = makeQuickPackOptions(target, argv);

    const entries = compilations[target];
    // $FlowOK
    const t: Target = target;
    return buildConfig(t, entries, options);
  });

  startCompiler(configs, argv.watch);
}

function startCompiler(configs:Array<any>, watch: boolean) {
  const compiler = webpack(configs);

  if(watch) {
    compiler.watch({ // watch options:
      aggregateTimeout: 300, // wait so long for more changes
      // poll: false // use polling instead of native watchers
      // pass a number to set the polling interval
    }, report);
  } else {
    compiler.run(report);
  }
}
