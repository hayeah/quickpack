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

var progressBar = new ProgressBar("[:msg] :bar",{
  width: 50,
  total: 100,
})

var progressPlugin = new ProgressPlugin(function(percentage, msg) {
  progressBar.update(percentage,{msg: msg || "done"});
  if(percentage == 1) {
    progressBar.terminate();
  }

  // console.log(percentage,msg);npm
});

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

module.exports = function buildConfig(argv) {
  var projectRoot = process.cwd();

  var input = argv._.slice(1)

  var outputDir = path.join(projectRoot,argv.output);

  var disableHashing = argv.hash !== true;

  var extractCSS = new ExtractTextPlugin(disableHashing ? "app.css" : "app-[contenthash].css");

  var production = argv.production === true || process.env.NODE_ENV == "production";

  var cssLoader = "style-loader!css-loader!postcss-loader";
  if(production) {
    cssLoader = ExtractTextPlugin.extract("style-loader", "css-loader!postcss-loader");
  }

  // var hot = argv.target != "no"
  var nodeMode = argv.target === "node";
  var webMode = argv.target !== "node";

  var serverMode = argv.serverMode === true;
  var hotReloadMode = argv.serverMode === true;


  var config = {
    context: projectRoot,

    // a=./bar.js b=./baz.js
    entry: extractEntries(input),

    output: {
      path: outputDir,
      filename: disableHashing ? "[name].js" : "[name]-[hash].js",
      // TODO: not sure what's a sane way to change public path...
      publicPath:  "/build/",
      // publicPath:  path.join("/build/"),
    },

    resolve: {
      root: projectRoot,
      modulesDirectories: [
        // path.join(projectRoot, 'node_modules'),
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
        '.css'
      ]
    },

    resolveLoader: {
      "modulesDirectories": [
        // path.join(process.cwd(), 'node_modules'),
        path.join(__dirname, 'node_modules')
      ],
    },

    // default: "cheap-module-eval-source-map"
    // cheap-module-eval-source-map doesn't work for Safari
    devtool: argv["source-map"] === true && !nodeMode && !production && argv["source-map-type"],

    module: {
      loaders: [
          // { test: /\.css$/, loader: "style!css" }
        {
          test: /\.json$/,
          loader: "json"
        },

        {
          test: /\.jsx?$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel-loader',
        },

        {
          test: /\.css$/,
          loader: cssLoader,
        },

        {
          test: /\.(png|jpg)$/,
          // loader: "file?name=[name].[hash].[ext]!url?limit=25000"
          loader: "url?limit=8192"
        },

        // Chaining loaders
        // https://github.com/webpack/webpack/issues/482#issuecomment-56161239

        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          exclude: /(node_modules|bower_components)/,
          loader: 'babel-loader',
        },

        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
          query: {
            transpileOnly: true,
            silent: true,
            compilerOptions: {
              module: "commonjs",
              jsx: "react",
              target: "es6",
            },
          },
        },




        // {
        //   test: /\.tsx?$/,
        //   // exclude: /(node_modules|bower_components)/,
        //   exclude: /node_modules/,
        //   loader: "babel!ts?transpileOnly=true"
        // },
      ]
    },

    plugins: removeNulls([
      new webpack.optimize.OccurenceOrderPlugin(),
      hotReloadMode && new webpack.HotModuleReplacementPlugin(),
      serverMode && new webpack.NoErrorsPlugin(),

      progressPlugin,
      extractCSS,
    ]),

    babel: {
      presets: removeNulls([
        // TODO should only activate in server mode, i guess...
        // !argv.production && require('babel-preset-react-hmre'),
        require('babel-preset-es2015'),
        require('babel-preset-react'),
      ]),

      env: {
        development: {
          presets: removeNulls([
            hotReloadMode && require('babel-preset-react-hmre'),
          ]),
        }
      }

    },

    postcss: [
      require('autoprefixer'),
    ],
  }

  var packageJSON = require(path.join(projectRoot,"package.json"));

  // Treat all peer dependencies as external.
  var externals = {};
  Object.assign(externals,packageJSON.peerDependencies);

  // If target is node, don't pack node_modules stuff into the bundle.
  if(nodeMode) {
    config.target = "node";
    Object.assign(externals,packageJSON.dependencies)
  }

  var dependencies = {};
  Object.keys(externals).forEach(mod => {
    dependencies[mod] = "commonjs " + mod;
  });

  config.externals = dependencies;


  if(production && argv.uglify === true) {
    config.plugins.push(new UglifyJsPlugin());
  }


  // https://github.com/sporto/assets-webpack-plugin
  if(!disableHashing) {
    var assetsPlugin = new AssetsPlugin({
      filename: "assets.json",
      path: outputDir,
      prettyPrint: true,
    });
    config.plugins.push(assetsPlugin);
  }

  if(argv.library !== false) {
    // module.exports = xxx
    config.output.libraryTarget = "commonjs2";
  }

  return config;
}



function removeNulls(array) {
  return array.filter(function(item) {
     return Boolean(item);
  });
}


