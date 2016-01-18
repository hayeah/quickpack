var path = require("path");

var webpack = require("webpack");

var argv = require('optimist').argv;
var config = require("./build-config")(argv);

// TODO: check that it's a npm project. Or who cares ¯\_(ツ)_/¯

// console.log("Running webpack at",projectRoot);

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