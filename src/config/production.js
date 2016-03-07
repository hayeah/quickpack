/* @flow */

import webpack from "webpack";
import UglifyJsPlugin from "webpack/lib/optimize/UglifyJsPlugin";

import type {WebpackConfig, QuickPackOptions} from "../options";

export default function configProduction(config:WebpackConfig,options:QuickPackOptions): void {
  config.plugins.push(new webpack.optimize.OccurenceOrderPlugin());

  config.plugins.push(new webpack.optimize.DedupePlugin());

  // uglify does not support ES6
  // https://github.com/mishoo/UglifyJS2/issues/448
  if(!options.useES6 && options.useUglify) {
    config.plugins.push(new UglifyJsPlugin());
  }
}
