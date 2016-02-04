/* @flow */

var path = require("path");

var webpack = require("webpack");

export type WebpackConfig = any;

export type QuickPackOptions = {
  projectRoot: string,
  sourceMap: boolean,
  sourceMapType: string,
  output: string,
  hash: boolean,
  target: Target,

  production: boolean,

  useProduction: boolean,
  useWatch: boolean,
  useHotReload: boolean,
  useServer: boolean,
  useUglify: boolean,
};

// massage the CLI arguments a bit...
export function normalizeQuickPackOptions(target:Target, argv:any): QuickPackOptions {
  // var production = argv.production === true || process.env.NODE_ENV == "production";

  let options = Object.assign({},{
    target,
    projectRoot: process.cwd(),

    useProduction: argv.production === true || process.env.NODE_ENV == "production",
    useHotReload: argv.server === true,
    useWatch: argv.watch === true,
    useUglify: argv.uglify === true,
  },argv);

  return options;
}

type Target = "web" | "node";

type Entries = {
  [key:string]: string
};

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

function devtool(config:WebpackConfig,options:QuickPackOptions) {
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

import configCSS from "./config/css";
import configBabel from "./config/babel";
import configExternals from "./config/externals";
import configResolve from "./config/resolve";
import configProgressReport from "./config/progressReport";
import configProduction from "./config/production";
import configTypeScript from "./config/typescript";

export function buildConfig(target:Target,entries:Entries,argv:QuickPackOptions): WebpackConfig {
  let options = normalizeQuickPackOptions(target,argv);

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
    devtool,

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
//       loaders: [
//           // { test: /\.css$/, loader: "style!css" }
//
//       ]
//     },
//
//     plugins: removeNulls([
//       mode.hotReload && new webpack.HotModuleReplacementPlugin(),
//       mode.server && new webpack.NoErrorsPlugin(),
//     ]),
//

//   }
//
//   configureResolve(config,argv,mode);
//
//
//   if(argv.library !== false) {
//     // module.exports = xxx
//     config.output.libraryTarget = "commonjs2";
//   }
//
//   return config;
// }



function removeNulls(array) {
  return array.filter(function(item) {
     return Boolean(item);
  });
}
