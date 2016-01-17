var path = require("path");
var ProgressBar = require("progress");

var ProgressPlugin = require("webpack/lib/ProgressPlugin");

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

module.exports = {
  // entry: "./index.js",

  // output: {
  //   // path: __dirname,
  //   filename: "./public/app.js"
  // },

  resolve: {
    root: process.cwd(),
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.jsx']
  },

  resolveLoader: {
    "modulesDirectories": [
      // path.join(process.cwd(), 'node_modules'),
      path.join(__dirname, 'node_modules')
    ],
  },

  devtool: "source-map",

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



      // {
      //   test: /\.tsx?$/,
      //   // exclude: /(node_modules|bower_components)/,
      //   exclude: /node_modules/,
      //   loader: "babel!ts?transpileOnly=true"
      // },
    ]
  },

  plugins: [
    progressPlugin,
  ],

  babel: {
    presets: [
      require('babel-preset-es2015'),
      require('babel-preset-react'),
    ]
  }
}