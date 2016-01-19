var webpack = require("webpack");
var Server = require("webpack-dev-server");

var argv = require('optimist').argv;

var config = require("./build-config")(argv);

var compiler = webpack(config);

var projectRoot = process.cwd();

new Server(compiler,{
  contentBase: projectRoot,
  publicPath: config.output.publicPath,
}).listen(8888,function(err) {
  if(err) {
    console.error(err);
    process.exit(1);
  }
  console.log("listening on 8888")
});