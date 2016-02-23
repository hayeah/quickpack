/* @flow */

import type {WebpackConfig, QuickPackOptions} from "../options";
import path from "path";
import fs from "fs";

export default function configExternals(config:WebpackConfig,options:QuickPackOptions): void {
  const {projectRoot,target} = options;
  let packageJSONPath = path.join(projectRoot,"package.json");

  if(!fs.existsSync(packageJSONPath)) {
    return;
  }
  // $FlowOK
  let packageJSON = require(packageJSONPath);

  // Treat all peer dependencies as external.
  var externals = {};
  Object.assign(externals,packageJSON.peerDependencies);

  // If target is node, don't pack node_modules stuff into the bundle.
  if(target === "node") {
    Object.assign(externals, packageJSON.dependencies || {});
    Object.assign(externals, packageJSON.devDependencies || {});
  }

  var dependencies = {};
  Object.keys(externals).forEach(mod => {
    dependencies[mod] = "commonjs " + mod;
  });

  config.externals = dependencies;
}
