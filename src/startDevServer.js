/* @flow */

var webpack = require("webpack");
var Server = require("webpack-dev-server");

import detectPort from "detect-port";
import type {QuickPackOptions} from "./options";

export default function startDevServer(config: any, options: QuickPackOptions) {
  let port = options.devServerPort;

  let compiler = webpack(config);

  var serverOptions: any = {
    contentBase: options.projectRoot,
    publicPath: config.output.publicPath,
    // hot: true,
    stats: "normal",
    // quiet: true,
  }

  const {forwardServer} = options;
  if(options.forwardServer !== undefined) {
    // TODO massage URL
    var backendHost = forwardServer;
    serverOptions.proxy = {
      '/*': {
        target: backendHost,
        secure: false,
      },
    }
  }

  console.log("Server starting on:", port);
  if(forwardServer) {
    console.log("Proxy to backend server:", forwardServer);
  }

  new Server(compiler,serverOptions).listen(port,function(err) {
    if(err) {
      console.error(err);
      process.exit(1);
    }
  });
}

  //
  // // Add the auto-refresh client code to the front of each entry.
  // // The query url at the end is used to determine the address of the webpack server.
  // // var devClient = [require.resolve("../client/") + "?" + protocol + "://" + options.host + ":" + options.port];
  // var devClient = [require.resolve("webpack-dev-server/client/") + "?" + "http" + "://" + "127.0.0.1" + ":" + port];
  //
  // // if(argv.hot) {
  // // }
  // devClient.push(require.resolve("webpack/hot/dev-server"));
  //
  // var entries = {};
  // Object.keys(config.entry).forEach(function(name) {
  //   entries[name] = devClient.concat([config.entry[name]]);
  // });
  //
