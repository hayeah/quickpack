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
import configHotReload from "./config/hot-reload";

export default buildConfig;

type Target = "web" | "node" | "library";

export function buildConfig(target: Target, entries: Entries, options: QuickPackOptions): WebpackConfig {
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

  if(options.useServer && target === "web") {
    [configHotReload].forEach(fn => {
      fn(config,options);
    });
  }

  if(options.useProduction) {
    [
      configProduction
    ].forEach(fn => {
      fn(config,options);
    });
  }

  // Don't output assets if there's compilation error.
  // https://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
  config.plugins.push(new webpack.NoErrorsPlugin());

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

  if(options.isLibrary) {
    // $FlowOK
    config.output.libraryTarget = "commonjs2";
  }
}

function configSourceMap(config:WebpackConfig,options:QuickPackOptions) {
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
