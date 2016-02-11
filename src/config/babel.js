/* @flow */

import type {WebpackConfig, QuickPackOptions} from "../options";

import loadModulesWithProgress from "../loadModulesWithProgress";

export default function configBabel(config: WebpackConfig, options: QuickPackOptions): void {
  const {useHotReload} = options;

  let [babelLoader,...babelPresets] = loadModulesWithProgress([
    "babel-loader", // preload babel-loader
    // holy crap! flatten and dedup the presets is sooooooo fast!
    'babel-flatten-presets/es2015-stage1',
    // "babel-preset-es2015",
    // "babel-preset-stage-1",
    'babel-preset-react'
  ]);

  let loaders = [
    {
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel-loader',
    }
  ];

  config.module.loaders.push(...loaders);

  config.babel = {
    presets: babelPresets,

    plugins: [
    ],
  };
}
