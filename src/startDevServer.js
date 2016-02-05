/* @flow */

var webpack = require("webpack");
var Server = require("webpack-dev-server");

import detectPort from "detect-port";
import type {QuickPackOptions} from "./options";

export default function startDevServer(config: any, options: QuickPackOptions) {
  console.log("start server", config);

  detectPort(options.devServerPort,(err,port) => {
    if(err) {
      console.log(err);
      process.exit(1);
    }

    let compiler = webpack(config);

    var serverOptions = {
      contentBase: options.projectRoot,
      publicPath: config.output.publicPath,
      hot: true,
      stats: "normal",
      // quiet: true,
    }

    // if(argv.forward != null) {
    //   var backendHost = argv.forward;
    //   serverOptions.proxy = {
    //     '/*': {
    //       target: backendHost,
    //       secure: false,
    //     },
    //   }
    // }

    console.log("Server starting on:", port);

    new Server(compiler,serverOptions).listen(port,function(err) {
      if(err) {
        console.error(err);
        process.exit(1);
      }
    });
  });
}

  // argv.serverMode = true;
  //
  // // TODO mix this with build?
  // let items = argv._.slice(1);
  // let compilations = extractEntriesFromArguments(items);
  // var config = buildConfig("web", compilations["web"], argv);
  // var projectRoot = process.cwd();
  //
  // let port = options.port || process.env.PORT || 8000;
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
