/* @flow */

// TODO: check that it's a npm project. Or who cares ¯\_(ツ)_/¯


import webpack from "webpack";

import type {QuickPackOptions} from "./options";
import type {ArgV} from "./cli";
import normalizeQuickPackOptions from "./options";

import detectPort from "detect-port";

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

import type { Target } from "./build-config";
import {buildConfig} from "./build-config";
import {extractEntriesFromArguments} from "./processEntries";

import startDevServer from "./startDevServer";

export default function build(argv: ArgV): void {
  const options = normalizeQuickPackOptions(argv);

  const items = argv._.slice(1);

  // sort arguments into different targets
  const compilations = extractEntriesFromArguments(items, options.defaultTarget);

  if(options.useServer) {
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
    const entries = compilations[target];
    // $FlowOK
    const t: Target = target;
    return buildConfig(t, entries, options);
  });

  startCompiler(configs, options);
}

function startCompiler(configs:Array<any>, options: QuickPackOptions) {
  const compiler = webpack(configs);

  if(options.useWatch) {
    compiler.watch({ // watch options:
      aggregateTimeout: 300, // wait so long for more changes
      // poll: false // use polling instead of native watchers
      // pass a number to set the polling interval
    }, report);
  } else {
    compiler.run(report);
  }
}
