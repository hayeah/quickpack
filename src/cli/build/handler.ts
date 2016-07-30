/* @flow */

const webpack = require("webpack");
const detectPort = require("detect-port")

import { makeQuickPackOptions } from "./makeQuickPackOptions";

import { ArgV } from "../build";

import { Target } from "../../config";
import { buildConfig } from "../../config";

import { extractEntriesFromArguments } from "../../processEntries";

import startDevServer from "../../startDevServer";

import * as qfs from "q-io/fs";
import * as path from "path";

export default handler;

export function handler(argv: ArgV): void {
  let items = argv._.slice(1);

  if (items.length === 0) {
    items = ["index"];
  }

  const defaultTarget = argv.target || "web";

  // sort arguments into different targets
  const compilations = extractEntriesFromArguments(items, defaultTarget);


  if(argv.server) {
    const options = makeQuickPackOptions("web", argv);
    const web = compilations["web"];
    if(web !== undefined) {
      delete compilations["web"];
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
      aggregateTimeout: 0, // wait so long for more changes
      // poll: false // use polling instead of native watchers
      // pass a number to set the polling interval
    }, report);
  } else {
    compiler.run(report);
  }
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
