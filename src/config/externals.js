/* @flow */

import type {WebpackConfig, QuickPackOptions} from "../build-config";
import path from "path";

export default function configExternals(config:WebpackConfig,options:QuickPackOptions): void {
  const {projectRoot,target} = options;
  let packageJSONPath = path.join(projectRoot,"package.json");
  // $FlowOK
  let packageJSON = require(packageJSONPath);

  // Treat all peer dependencies as external.
  var externals = {};
  Object.assign(externals,packageJSON.peerDependencies);

  // If target is node, don't pack node_modules stuff into the bundle.
  if(target === "node") {
    Object.assign(externals,packageJSON.dependencies)
  }

  var dependencies = {};
  Object.keys(externals).forEach(mod => {
    dependencies[mod] = "commonjs " + mod;
  });

  config.externals = dependencies;
}
