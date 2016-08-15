/* @flow */

const webpack = require("webpack");
const UglifyJsPlugin = require("webpack/lib/optimize/UglifyJsPlugin");

import {WebpackConfig, QuickPackOptions} from "../options";

export default function configProduction(config: WebpackConfig, options: QuickPackOptions): void {

  config.plugins.push(new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': '"production"'
    }
  }));
  config.plugins.push(new webpack.optimize.OccurenceOrderPlugin());

  config.plugins.push(new webpack.optimize.DedupePlugin());

  // uglify does not support ES6
  // https://github.com/mishoo/UglifyJS2/issues/448
  if (!options.useES6 && options.useUglify) {
    config.plugins.push(new UglifyJsPlugin());
  }
}
