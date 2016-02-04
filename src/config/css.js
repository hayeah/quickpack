/* @flow */

import type {WebpackConfig,QuickPackOptions} from "../build-config";

import ExtractTextPlugin from "extract-text-webpack-plugin";
import AssetsPlugin from 'assets-webpack-plugin';

import autoprefixer from 'autoprefixer';

export default function configCSS(config: WebpackConfig, options: QuickPackOptions) {
  const {useProduction} = options;

  let cssLoader = "style-loader!css-loader!postcss-loader";
  let scssLoader = "style-loader!css-loader!sass-loader";
  let lessLoader = "style-loader!css-loader!less-loader";

  if(useProduction) {
    cssLoader = ExtractTextPlugin.extract("style-loader", "css-loader!postcss-loader");
  }

  if(useProduction) {
    scssLoader = ExtractTextPlugin.extract("style-loader", "style-loader!css-loader!sass-loader");
  }

  if(useProduction) {
    lessLoader = ExtractTextPlugin.extract("style-loader", "style-loader!css-loader!less-loader");
  }

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

  config.postcss = [autoprefixer];

  if(useProduction) {
    // var extractCSS = new ExtractTextPlugin(disableHashing ? "app.css" : "app-[contenthash].css");
    config.plugins.push(new ExtractTextPlugin("[name].css"));
  }

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
