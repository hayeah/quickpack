/* @flow */

/*
quickpack a=./bar.js b=./baz.js  ... <outputDir>
*/

var path = require("path");

var webpack = require("webpack");

var ProgressBar = require("progress");

var ProgressPlugin = require("webpack/lib/ProgressPlugin");
var UglifyJsPlugin = require("webpack/lib/optimize/UglifyJsPlugin");

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

var progressBar = new ProgressBar("[:msg] :bar",{
  width: 50,
  total: 100,
})

function configProgressReport(config: WebpackConfig): void {
  let progressPlugin = new ProgressPlugin(function(percentage, msg) {
    progressBar.update(percentage,{msg: msg || "done"});
    if(percentage == 1) {
      progressBar.terminate();
    }
    // console.log(percentage,msg);
  });

  config.plugins.push(progressPlugin);
}

function extractEntries(items) {
  var entries = {};

  items.forEach(function(item) {
    if(item.indexOf("=") !== -1) {
      var parts = item.split("=");
      var key = parts[0];
      var file = parts[1];

      entries[key] = file;
    } else {
      var ext = path.extname(item);
      var filename = path.basename(item,ext);

      entries[filename] = item;
    }
  });

  return entries;
}

function configResolve(config:WebpackConfig,options:QuickPackOptions,mode) {
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

function configExternals(config:WebpackConfig,options:QuickPackOptions): void {
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

import {configBabel} from "./babel-options";

function devtool(config:WebpackConfig,options:QuickPackOptions) {
  const {sourceMap, sourceMapType, target, production} = options;
  if(sourceMap && !production) {
    config.devtool = sourceMapType;
  }
}

function babel(config:WebpackConfig,options:QuickPackOptions):void {
  let loaders = [
    {
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel-loader',
    }
  ];

  config.module.loaders.push(...loaders);

  config.babel = configBabel(options);
}

function configProduction(config:WebpackConfig,options:QuickPackOptions): void {
  config.plugins.push(new webpack.optimize.OccurenceOrderPlugin());

  if(options.useUglify) {
    config.plugins.push(new UglifyJsPlugin());
  }
}

import configCSS from "./config/css";

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

    // ES6, jsx
    // babel,

    configCSS,

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
//         {
//           test: /\.json$/,
//           loader: "json"
//         },
//

//         {
//           test: /\.(png|jpg)$/,
//           // loader: "file?name=[name].[hash].[ext]!url?limit=25000"
//           loader: "url?limit=8192"
//         },
//
//         // Chaining loaders
//         // https://github.com/webpack/webpack/issues/482#issuecomment-56161239
//
//         {
//           test: /\.tsx?$/,
//           // exclude: /(node_modules|bower_components)/,
//           loader: 'babel-loader',
//         },
//
//         {
//           test: /\.tsx?$/,
//           loader: 'ts-loader',
//           // exclude: /node_modules/,
//           query: {
//             transpileOnly: true,
//             silent: true,
//             compilerOptions: {
//               module: "commonjs",
//               jsx: "react",
//               target: "es6",
//             },
//           },
//         },
//       ]
//     },
//
//     plugins: removeNulls([
//       new webpack.optimize.OccurenceOrderPlugin(),
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
