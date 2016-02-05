/* @flow */

// TODO: check that it's a npm project. Or who cares ¯\_(ツ)_/¯

import type {QuickPackOptions} from "./options";
import webpack from "webpack";

import normalizeQuickPackOptions from "./options";

function report(err,stats) {
  if(err) {
    console.error(err.stack || err);
    if(err.details) console.error(err.details);
    return;
  }

  process.stdout.write(stats.toString("normal"));
}

import {buildConfig} from "./build-config";
import {extractEntriesFromArguments} from "./processEntries";

import startDevServer from "./startDevServer";

export default function build(argv:any): void {
  console.log(argv);

  let options = normalizeQuickPackOptions(argv);

  let items = argv._.slice(1);

  // sort arguments into different targets
  let compilations = extractEntriesFromArguments(items);

  if(options.useServer) {
    let web = compilations.web;
    if(web !== undefined) {
      delete compilations.web;
      let config = buildConfig("web", web, options);
      startDevServer(config, options);
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

  if(options.useWatch === true) {
    compiler.watch({ // watch options:
      aggregateTimeout: 300, // wait so long for more changes
      // poll: false // use polling instead of native watchers
      // pass a number to set the polling interval
    }, report);
  } else {
    compiler.run(report);
  }
}
