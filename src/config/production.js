/* @flow */

import webpack from "webpack";
import UglifyJsPlugin from "webpack/lib/optimize/UglifyJsPlugin";

import type {WebpackConfig, QuickPackOptions} from "../options";

export default function configProduction(config:WebpackConfig,options:QuickPackOptions): void {
  config.plugins.push(new webpack.optimize.OccurenceOrderPlugin());

  if(options.useUglify) {
    config.plugins.push(new UglifyJsPlugin());
  }
}
