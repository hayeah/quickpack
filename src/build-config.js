/* @flow */

/*
quickpack a=./bar.js b=./baz.js  ... <outputDir>
*/

var path = require("path");

var webpack = require("webpack");

var ProgressBar = require("progress");

var ProgressPlugin = require("webpack/lib/ProgressPlugin");
var UglifyJsPlugin = require("webpack/lib/optimize/UglifyJsPlugin");

var AssetsPlugin = require('assets-webpack-plugin');

var ExtractTextPlugin = require("extract-text-webpack-plugin");

type WebpackConfig = any;

export type QuickPackOptions = {
  projectRoot: string,
  sourceMap: boolean,
  sourceMapType: string,
  output: string,
  hash: boolean,
  target: Target,

  production: boolean,

  useWatch: boolean,
  useHotReload: boolean,
  useServer: boolean,
};

// massage the CLI arguments a bit...
export function normalizeQuickPackOptions(target:Target,argv:any): QuickPackOptions {
  let options = Object.assign({},{
    target,
    projectRoot: process.cwd(),
    useHotReload: argv.server === true,
    useWatch: argv.watch === true,
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

function modesFromOptions(argv) {
  // var nodeMode = argv.target === "node";
  // var webMode = argv.target !== "node";

  // var serverMode = argv.serverMode === true;
  // var hotReloadMode = argv.serverMode === true;
  return {
    node: argv.target === "node",
    web: argv.target !== "node",

    server: argv.serverMode === true,
    hotReload: argv.serverMode === true,
  };
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

export function buildConfig(target:Target,entries:Entries,argv:QuickPackOptions): WebpackConfig {
  let options = normalizeQuickPackOptions(target,argv);

  const {projectRoot} = options;

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

    configExternals,
    configProgressReport,
  ].forEach(fn => {
    fn(config,options);
  });

  return config;
}

// function _buildConfig(argv:QuickPackOptions) {
//   var projectRoot = process.cwd();
//
//   argv.projectRoot = projectRoot;
//
//   var input = argv._.slice(1)
//
//   var outputDir = path.join(projectRoot,argv.output);
//
//   var disableHashing = argv.hash !== true;
//
//   var extractCSS = new ExtractTextPlugin(disableHashing ? "app.css" : "app-[contenthash].css");
//
//   var production = argv.production === true || process.env.NODE_ENV == "production";
//
//   var cssLoader = "style-loader!css-loader!postcss-loader";
//   if(production) {
//     cssLoader = ExtractTextPlugin.extract("style-loader", "css-loader!postcss-loader");
//   }
//
//   var scssLoader = "style-loader!css-loader!sass-loader";
//   if(production) {
//     scssLoader = ExtractTextPlugin.extract("style-loader", "style-loader!css-loader!sass-loader");
//   }
//
//   var lessLoader = "style-loader!css-loader!less-loader";
//   if(production) {
//     lessLoader = ExtractTextPlugin.extract("style-loader", "style-loader!css-loader!less-loader");
//   }
//
//   lessLoader = ExtractTextPlugin.extract("style-loader", "style-loader!css-loader!less-loader");
//
//
//
//   var mode = modesFromOptions(argv);
//
//   var config = {
//     context: projectRoot,
//
//     // a=./bar.js b=./baz.js
//     entry: extractEntries(input),
//
//     output: {
//       path: outputDir,
//       filename: disableHashing ? "[name].js" : "[name]-[hash].js",
//       // TODO: not sure what's a sane way to change public path...
//       publicPath:  "/build/",
//       // publicPath:  path.join("/build/"),
//     },
//
//     // default: "cheap-module-eval-source-map"
//     // cheap-module-eval-source-map doesn't work for Safari
//     devtool: argv["source-map"] === true && !mode.node && !production && argv["source-map-type"],
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
//           test: /\.jsx?$/,
//           exclude: /(node_modules|bower_components)/,
//           loader: 'babel-loader',
//         },
//
//         {
//           test: /\.css$/,
//           loader: cssLoader,
//         },
//
//         {
//           test: /\.scss$/,
//           loader: scssLoader,
//         },
//
//         {
//           test: /\.less$/,
//           loader: lessLoader,
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
//
//       progressPlugin,
//       extractCSS,
//     ]),
//
//     babel: require("./babel-options")(argv,mode),
//
//     postcss: [
//       require('autoprefixer'),
//     ],
//   }
//
//   configureResolve(config,argv,mode);
//
//   var packageJSON = require(path.join(projectRoot,"package.json"));
//
//   // Treat all peer dependencies as external.
//   var externals = {};
//   Object.assign(externals,packageJSON.peerDependencies);
//
//   // If target is node, don't pack node_modules stuff into the bundle.
//   if(mode.node) {
//     config.target = "node";
//     Object.assign(externals,packageJSON.dependencies)
//   }
//
//   var dependencies = {};
//   Object.keys(externals).forEach(mod => {
//     dependencies[mod] = "commonjs " + mod;
//   });
//
//   config.externals = dependencies;
//
//
//   if(production && argv.uglify === true) {
//     config.plugins.push(new UglifyJsPlugin());
//   }
//
//
//   // https://github.com/sporto/assets-webpack-plugin
//   if(!disableHashing) {
//     var assetsPlugin = new AssetsPlugin({
//       filename: "assets.json",
//       path: outputDir,
//       prettyPrint: true,
//     });
//     config.plugins.push(assetsPlugin);
//   }
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
