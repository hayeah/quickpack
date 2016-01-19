var webpack = require("webpack");

function report(err,stats) {
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
}

function build(argv) {
  var config = require("./build-config")(argv);
  var compiler = webpack(config);

  if(argv.watch == true) {
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


