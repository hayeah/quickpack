#!/usr/bin/env node

var path = require("path");

var webpack = require("webpack");

var argv = require('optimist').argv;

if(argv.h || argv.help) {
  var help = `
quickpack page1=./entry1.js [page2=./entry2.js ...]

A prebaked Webpack configuration.
`
  console.log(help);
  process.exit(0);
}

var config = require("../build-config")(argv);

// TODO: check that it's a npm project. Or who cares ¯\_(ツ)_/¯
var compiler = webpack(config);

compiler.watch({ // watch options:
    aggregateTimeout: 300, // wait so long for more changes
    // poll: false // use polling instead of native watchers
    // pass a number to set the polling interval
}, function(err, stats) {
  if(err) {
    console.error(err.stack || err);
    if(err.details) console.error(err.details);
    return;
  }

  if(stats.hasErrors) {
    process.stdout.write(stats.toString({
      errorDetails: true,
      colors: require("supports-color"),
    }));
  }
});