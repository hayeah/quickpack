/* @flow */

var path = require("path");
var webpack = require("webpack");

import type {QuickPackOptions} from "./options";

export type WebpackConfig = any;

type Entries = {
  [key:string]: string
};

import configCSS from "./config/css";
import configBabel from "./config/babel";
import configExternals from "./config/externals";
import configResolve from "./config/resolve";
import configProgressReport from "./config/progressReport";
import configProduction from "./config/production";
import configTypeScript from "./config/typescript";

export default buildConfig;

export function buildConfig(target:string, entries:Entries, argv:QuickPackOptions): WebpackConfig {
  let options = Object.assign({},options,{target});

  const {projectRoot, production} = options;

  let config: WebpackConfig = {
    context: projectRoot,
    target: target,
    entry: entries,

    module: {
      loaders: [],
    },

    plugins: [],
  };

  [
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
  ].forEach(fn => {
    fn(config,options);
  });

  if(production) {
    [
      configProduction
    ].forEach(fn => {
      fn(config,options);
    });
  }

  return config;
}

function configOutput(config:WebpackConfig,options:QuickPackOptions) {
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
}

function configSourceMap(config:WebpackConfig,options:QuickPackOptions) {
  const {sourceMap, sourceMapType, target, production} = options;
  if(sourceMap && !production) {
    config.devtool = sourceMapType;
  }
}

function configStaticResources(config:WebpackConfig, options:QuickPackOptions) {
  let loaders = [
    {
      test: /\.json$/,
      loader: "json"
    },

    {
      test: /\.(png|jpg)$/,
      // loader: "file?name=[name].[hash].[ext]!url?limit=25000"
      loader: "url?limit=8192"
    },
  ];

  config.module.loaders.push(...loaders);
}

// function _buildConfig(argv:QuickPackOptions) {
//
//   var input = argv._.slice(1)
//
//
//   var disableHashing = argv.hash !== true;
//
//
//
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
//
//     plugins: removeNulls([
//       mode.hotReload && new webpack.HotModuleReplacementPlugin(),
//       mode.server && new webpack.NoErrorsPlugin(),
//     ]),
//

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
