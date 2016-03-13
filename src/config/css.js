/* @flow */

import type {WebpackConfig, QuickPackOptions} from "../options";

import ExtractTextPlugin from "extract-text-webpack-plugin";
import AssetsPlugin from 'assets-webpack-plugin';

import autoprefixer from 'autoprefixer';
import postcssNested from 'postcss-nested'

export default function configCSS(config: WebpackConfig, options: QuickPackOptions) {
  const {useProduction} = options;

  const cssLoader = ExtractTextPlugin.extract("style-loader", "css-loader?sourceMap!postcss-loader?sourceMap");
  const scssLoader = ExtractTextPlugin.extract("style-loader", "css-loader?sourceMap!sass-loader?sourceMap");
  const lessLoader = ExtractTextPlugin.extract("style-loader", "css-loader?sourceMap!less-loader?sourceMap");

  let loaders = [
    {
      test: /\.css$/,
      loader: cssLoader,
    },

    {
      test: /\.scss$/,
      loader: scssLoader,
    },

    {
      test: /\.less$/,
      loader: lessLoader,
    },
  ];

  config.module.loaders.push(...loaders);

  config.postcss = [
    autoprefixer,
    postcssNested({}),
  ];

  // var extractCSS = new ExtractTextPlugin(disableHashing ? "app.css" : "app-[contenthash].css");
  config.plugins.push(new ExtractTextPlugin("[name].css"));

    // https://github.com/sporto/assets-webpack-plugin
  // if(!disableHashing) {
  //   var assetsPlugin = new AssetsPlugin({
  //     filename: "assets.json",
  //     path: outputDir,
  //     prettyPrint: true,
  //   });
  //   config.plugins.push(assetsPlugin);
  // }
}
