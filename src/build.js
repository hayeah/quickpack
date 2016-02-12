/* @flow */

// TODO: check that it's a npm project. Or who cares ¯\_(ツ)_/¯


import webpack from "webpack";

import type {QuickPackOptions} from "./options";
import type {ArgV} from "./command";
import normalizeQuickPackOptions from "./options";

import detectPort from "detect-port";

function report(err,stats) {
  if(err) {
    console.error(err.stack || err);
    if(err.details) console.error(err.details);
    return;
  }

  // process.stdout.write(stats.toString("normal"));

  // const json = stats.toJson();
  // console.log(JSON.stringify(json.chunks, null, 2));
  // console.log(JSON.stringify(json.assetsByChunkName, null, 2));
  // console.log(JSON.stringify(json.assets, null, 2));
}

import {buildConfig} from "./build-config";
import {extractEntriesFromArguments} from "./processEntries";

import startDevServer from "./startDevServer";

export default function build(argv: ArgV): void {
  let options = normalizeQuickPackOptions(argv);

  let items = argv._.slice(1);

  // sort arguments into different targets
  let compilations = extractEntriesFromArguments(items);

  if(options.useServer) {
    let web = compilations.web;
    if(web !== undefined) {
      delete compilations.web;
      detectPort(options.devServerPort,(err,port) => {
        if(err) {
          console.log(err);
          process.exit(1);
        }

        options.devServerPort = port;

        let config = buildConfig("web", web, options);
        startDevServer(config, options);
      });

    }
  }

  let configs = Object.keys(compilations).map(target => {
    let entries = compilations[target];
    return buildConfig(target, entries, options);
  });

  startCompiler(configs, options);
}

function startCompiler(configs:Array<any>, options: QuickPackOptions) {
  let compiler = webpack(configs);

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
