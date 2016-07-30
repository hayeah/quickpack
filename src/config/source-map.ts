/* @flow */

import {WebpackConfig, QuickPackOptions} from "../options";

export default function configSourceMap(config:WebpackConfig,options:QuickPackOptions) {
  const {sourceMap, sourceMapType, target, production, sourceMapCheap} = options;
  if(sourceMap && !production) {
    let devtool = sourceMapCheap ? "cheap-module-eval-source-map" : "source-map";

    // allow option to override
    if(sourceMapType) {
      devtool = sourceMapType;
    }

    config.devtool = devtool;
  }
}
