var path = require("path");

var webpack = require("webpack");

var config = require("./config");
// returns a Compiler instance


var argv = require('optimist').argv;

// console.log(argv);

var projectRoot = process.cwd();

var entries = {};
argv._.forEach(function(item) {
  if(item.indexOf("=") !== -1) {
    var parts = item.split("=");
    var key = parts[0];
    var file = parts[1];

    entries[key] = file;
  }
});

config.context = process.cwd();

config.entry = entries;



// process.exit(0);

/*
./buildit a=./bar.js b=./baz.js  ... <outputDir>
*/


// compiler.run(function(err, stats) {
//     // ...
// });

// TODO: check that it's a npm project. Or who cares ¯\_(ツ)_/¯


config.output = {
  path: path.join(projectRoot,"build"),
  filename: "[name].js"
}

// console.log("Running webpack at",projectRoot);

// console.log("Webpack config",JSON.stringify(config,null,2));

var compiler = webpack(config);



// compiler.outputFileSystem = fs;

// compiler.run(function(err, stats) {
//   console.log("doen",err);
// });


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


    // console.log("webpack done",stats);
});