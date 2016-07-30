/* @flow */
import {WebpackConfig, QuickPackOptions} from "../options";

export default function config(config:WebpackConfig, options:QuickPackOptions) {
  let loaders = [
    {
      test: /\.json$/,
      loader: "json"
    },

    {
      test: /\.(png|jpg|svg|gif|woff2|woff|ttf)$/,
      // loader: "file?name=[name].[hash].[ext]!url?limit=25000"
      loader: "url?limit=8192&name=[name].[hash].[ext]",
    },
  ];

  config.module.loaders.push(...loaders);
}
