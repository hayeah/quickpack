/* @flow */

import type {WebpackConfig, QuickPackOptions} from "../options";

import ExtractTextPlugin from "extract-text-webpack-plugin";
import AssetsPlugin from 'assets-webpack-plugin';

import autoprefixer from 'autoprefixer';
import postcssNested from 'postcss-nested'
import { ExtractPlugin as ExtractJSCSSPlugin } from "jscss-loader";


export default function configCSS(config: WebpackConfig, options: QuickPackOptions) {
  const {useProduction} = options;

  // See: https://github.com/webpack/loader-utils#interpolatename
  let localIdentName: string;
  if(useProduction) {
    localIdentName = "[md5:hash:base64]";
  } else {
    localIdentName = "[path]__[name]_[ext]__[local]___[md5:hash:base64:5]";
  }

  const cssLoader = `css-loader?sourceMap&importLoaders=1&localIdentName=${localIdentName}`;

  const postcssLoader = ExtractTextPlugin.extract("style-loader", `${cssLoader}!postcss-loader?sourceMap`);
  const scssLoader = ExtractTextPlugin.extract("style-loader", `${cssLoader}!sass-loader?sourceMap`);
  const lessLoader = ExtractTextPlugin.extract("style-loader", `${cssLoader}!less-loader?sourceMap`);

  let loaders = [
    {
      test: /\.css$/,
      loader: postcssLoader,
    },

    {
      test: /\.scss$/,
      loader: scssLoader,
    },

    {
      test: /\.less$/,
      loader: lessLoader,
    },

    {
      test: /\.css\.(ts|js)$/,
      loader: "jscss-loader",
    },
  ];

  config.module.loaders.push(...loaders);

  config.postcss = [
    autoprefixer,
    postcssNested({}),
  ];

  // var extractCSS = new ExtractTextPlugin(disableHashing ? "app.css" : "app-[contenthash].css");
  config.plugins.push(new ExtractJSCSSPlugin());
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
