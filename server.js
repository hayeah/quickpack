var webpack = require("webpack");
var Server = require("webpack-dev-server");

function server(argv) {
  var config = require("./build-config")(argv);
  var compiler = webpack(config);

  var projectRoot = process.cwd();

  var port = process.env.PORT || argv.port;

  new Server(compiler,{
    contentBase: projectRoot,
    publicPath: config.output.publicPath,
  }).listen(port,function(err) {
    if(err) {
      console.error(err);
      process.exit(1);
    }
    console.log("Listening on: "+port);
  });
}

module.exports = server;