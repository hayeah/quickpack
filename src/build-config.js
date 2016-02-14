/* @flow */

import path from "path";
import webpack from "webpack";

import type {QuickPackOptions} from "./options";

export type WebpackConfig = any;

type Entries = {
  [key:string]: string
};

import configOutput from "./config/output";
import configCSS from "./config/css";
import configBabel from "./config/babel";
import configExternals from "./config/externals";
import configResolve from "./config/resolve";
import configProgressReport from "./config/progressReport";
import configProduction from "./config/production";
import configTypeScript from "./config/typescript";
import configHotReload from "./config/hot-reload";
import configSourceMap from "./config/source-map";
import configNode from "./config/node";
import configStaticResources from "./config/static-resources";

export default buildConfig;

type Target = "web" | "node" | "library";

export function buildConfig(target: Target, entries: Entries, options: QuickPackOptions): WebpackConfig {
  function applyConfigFunctions(...configFunctions) {
    configFunctions.forEach(fn => {
      fn(config,options);
    });
  }

  let isLibrary = false;
  if(target === "library") {
    target = "web";
    isLibrary = true;
  }
  options = Object.assign({},options,{
    target,
    isLibrary,
  });

  const {projectRoot, production} = options;

  const config: WebpackConfig = {
    context: projectRoot,
    target: target,
    entry: entries,

    module: {
      loaders: [],
    },

    plugins: [],
  };

  applyConfigFunctions(
    configOutput,
    configResolve,
    configOutput,
    configSourceMap,

    // ES6. js, jsx
    configBabel,
    // TypeScript. ts, tsx
    configTypeScript,

    configCSS,

    configStaticResources,
    configExternals,
    configProgressReport,
  );

  if(options.useServer && target === "web") {
    applyConfigFunctions(configHotReload);
  }

  if(options.useProduction) {
    applyConfigFunctions(configProduction);
  }

  if(options.target === "node") {
    applyConfigFunctions(configNode);
  }

  // Don't output assets if there's compilation error.
  // https://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
  config.plugins.push(new webpack.NoErrorsPlugin());

  return config;
}






//   var disableHashing = argv.hash !== true;
//
//   var config = {

//
//     module: {
//       preLoaders: [{
//         test: /\.jsx?$/,
//         exclude: /(node_modules|bower_components)/,
//         loader: 'import-glob',
//       }],
//
//     },


//   }
//
//
//   if(argv.library !== false) {
//     // module.exports = xxx
//     config.output.libraryTarget = "commonjs2";
//   }
//
//   return config;
// }
