/* @flow */
import path from "path";

import type {WebpackConfig, QuickPackOptions} from "../options";

export default function config(config:WebpackConfig,options:QuickPackOptions) {
  const {projectRoot,output} = options;

  // TODO check if output path is absolute path
  config.output = {
    path: path.join(projectRoot,output),
    // filename: disableHashing ? "[name].js" : "[name]-[hash].js",
    filename: "[name].js",
    // TODO: not sure what's a sane way to change public path...
    publicPath:  "/build/",
    // publicPath:  path.join("/build/"),
  }

  if(options.isLibrary) {
    // $FlowOK
    config.output.libraryTarget = "commonjs2";
  }
}
