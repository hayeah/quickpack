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
    }
  });

  return entries;
}

module.exports = function buildConfig(argv) {
  var projectRoot = process.cwd();

  var input = argv._.slice(1)

  var outputDir = path.join(projectRoot,"build");

  var disableHashing = argv.hash !== true;

  var extractCSS = new ExtractTextPlugin(disableHashing ? "app.css" : "app-[contenthash].css");

  var production = argv.production === true || process.env.NODE_ENV == "production";

  var cssLoader = "style-loader!css-loader!postcss-loader";
  if(production) {
    cssLoader = ExtractTextPlugin.extract("style-loader", "css-loader!postcss-loader");
  }


  var config = {
    context: projectRoot,

    // a=./bar.js b=./baz.js
    entry: extractEntries(input),

    output: {
      path: outputDir,
      filename: disableHashing ? "[name].js" : "[name]-[hash].js",
      publicPath: "/build/",
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
      extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.jsx','.css']
    },

    resolveLoader: {
      "modulesDirectories": [
        // path.join(process.cwd(), 'node_modules'),
        path.join(__dirname, 'node_modules')
      ],
    },

    devtool: "cheap-module-eval-source-map",

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
          loader: 'babel', // 'babel-loader' is also a legal name to reference
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




        // {
        //   test: /\.tsx?$/,
        //   // exclude: /(node_modules|bower_components)/,
        //   exclude: /node_modules/,
        //   loader: "babel!ts?transpileOnly=true"
        // },
      ]
    },

    plugins: [
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),

      progressPlugin,
      extractCSS,
    ],

    babel: {
      presets: removeNulls([
        // TODO should only activate in server mode, i guess...
        // !argv.production && require('babel-preset-react-hmre'),
        require('babel-preset-es2015'),
        require('babel-preset-react'),
      ]),

      env: {
        development: {
          presets: [
            require('babel-preset-react-hmre'),
          ],
        }
      }

    },

    postcss: [
      require('autoprefixer'),
    ],
  }

  if(argv.production) {
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


  return config;
}

function removeNulls(array) {
  return array.filter(function(item) {
     return item != null;
  });
}


