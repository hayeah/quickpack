/* @flow */

import type {WebpackConfig, QuickPackOptions} from "../build-config";
import path from "path";

export default function configResolve(config:WebpackConfig,options:QuickPackOptions) {
  const {projectRoot} = options;

  let resolve = {
    root: projectRoot,
    modulesDirectories: [
      path.join(projectRoot, 'node_modules'),
      "web_modules",
      "node_modules",
      path.join(__dirname, 'node_modules'),
    ],

    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: [
      '', '.webpack.js',
      '.web.js',
      '.ts', '.tsx',
      '.js', '.jsx',
      '.css', '.scss', '.less',
      ".json",
    ]
  };

  config.resolve = resolve;

  let resolveLoader = {
    "modulesDirectories": [
      // path.join(process.cwd(), 'node_modules'),
      path.join(__dirname, "..", 'node_modules')
    ],
  };


  config.resolveLoader = resolveLoader;
}
