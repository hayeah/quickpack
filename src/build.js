/* @flow */

import type {QuickPackOptions} from "./build-config";
import webpack from "webpack";

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

function build(argv:any) {
  console.log(argv);

  let options: QuickPackOptions = argv;
  let items = argv._.slice(1);
  let compilations = extractEntriesFromArguments(items);

  let multiconfig = Object.keys(compilations).map(target => {
    let entries = compilations[target];
    return buildConfig(target,entries,argv);
  });

  console.log(multiconfig);

  var compiler = webpack(multiconfig);

  if(options.watch == true) {
    compiler.watch({ // watch options:
      aggregateTimeout: 300, // wait so long for more changes
      // poll: false // use polling instead of native watchers
      // pass a number to set the polling interval
    }, report);
  } else {
    compiler.run(report);
  }
}

module.exports = build;

// TODO: check that it's a npm project. Or who cares ¯\_(ツ)_/¯