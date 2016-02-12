/* @flow */
import type {WebpackConfig, QuickPackOptions} from "../options";
import webpack from "webpack";

// disable hot module replacement for now. Too flaky.
export default function configHotReload(config: WebpackConfig, options: QuickPackOptions) {
  // let reactHotModuleReload = require('babel-preset-react-hmre');
  // config.babel.presets.push(reactHotModuleReload);

  // Add the auto-refresh client code to the front of each entry.
  // The query url at the end is used to determine the address of the webpack server.
  let devClient = [require.resolve("webpack-dev-server/client/") + "?" + "http" + "://" + "127.0.0.1" + ":" + options.devServerPort];
  // var devClient = [require.resolve("../client/") + "?" + protocol + "://" + options.host + ":" + options.port];

  // devClient.push(require.resolve("webpack/hot/dev-server"));

  var entries = {};
  Object.keys(config.entry).forEach(name => {
    entries[name] = devClient.concat([config.entry[name]]);
  });

  config.entry = entries;

  // config.plugins.push(new webpack.HotModuleReplacementPlugin())

}
