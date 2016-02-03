var webpack = require("webpack");
var Server = require("webpack-dev-server");



function server(argv) {
  argv.serverMode = true;

  var config = require("./build-config")(argv);
  var projectRoot = process.cwd();
  var port = argv.port || process.env.PORT || 8000;

  // Add the auto-refresh client code to the front of each entry.
  // The query url at the end is used to determine the address of the webpack server.
  // var devClient = [require.resolve("../client/") + "?" + protocol + "://" + options.host + ":" + options.port];
  var devClient = [require.resolve("webpack-dev-server/client/") + "?" + "http" + "://" + "127.0.0.1" + ":" + port];

  // if(argv.hot) {
  // }
  devClient.push(require.resolve("webpack/hot/dev-server"));

  var entries = {};
  Object.keys(config.entry).forEach(function(name) {
    entries[name] = devClient.concat([config.entry[name]]);
  });



  config.entry = entries;
  var compiler = webpack(config);

  console.log("Starting server on: "+port);

  var serverOptions = {
    contentBase: projectRoot,
    publicPath: config.output.publicPath,
    hot: true,
    stats: "normal",
    // quiet: true,
  }

  if(argv.forward != null) {
    var backendHost = argv.forward;
    serverOptions.proxy = {
      '/*': {
        target: backendHost,
        secure: false,
      },
    }
  }

  new Server(compiler,serverOptions).listen(port,function(err) {
    if(err) {
      console.error(err);
      process.exit(1);
    }
  });
}

module.exports = server;