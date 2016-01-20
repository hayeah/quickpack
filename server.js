var webpack = require("webpack");
var Server = require("webpack-dev-server");

function server(argv) {
  var config = require("./build-config")(argv);
  var projectRoot = process.cwd();
  var port = process.env.PORT || argv.port;

  // Add the auto-refresh client code to the front of each entry.
  // The query url at the end is used to determine the address of the webpack server.
  // var devClient = [require.resolve("../client/") + "?" + protocol + "://" + options.host + ":" + options.port];
  var devClient = [require.resolve("webpack-dev-server/client/") + "?" + "http" + "://" + "127.0.0.1" + ":" + argv.port];

  // if(argv.hot) {
  // }
  devClient.push(require.resolve("webpack/hot/dev-server"));

  var entries = {};
  Object.keys(config.entry).forEach(function(name) {
    entries[name] = devClient.concat([config.entry[name]]);
  });



  config.entry = entries;
  var compiler = webpack(config);

  new Server(compiler,{
    contentBase: projectRoot,
    publicPath: config.output.publicPath,
    hot: true,
  }).listen(port,function(err) {
    if(err) {
      console.error(err);
      process.exit(1);
    }
    console.log("Listening on: "+port);
  });
}

module.exports = server;