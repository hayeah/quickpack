/* @flow */

import type {WebpackConfig, QuickPackOptions} from "../options";

import loadModulesWithProgress from "../loadModulesWithProgress";

export default function configBabel(config: WebpackConfig, options: QuickPackOptions): void {
  const {useHotReload} = options;

  const presets = ['babel-preset-react'];

  if(options.useES6) {
    presets.push("quickpack-presets/modern");
  } else {
    // deduped es2015 + stage-1. much faster loading. see: https://github.com/hayeah/babel-fast-presets
    presets.push("babel-flatten-presets/es2015-stage1");
  }

  // load dependencies with progress reprot
  const [babelLoader,...babelPresets] = loadModulesWithProgress([
    "babel-loader",
  ].concat(presets));

  const loaders = [
    {
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel-loader',
    }
  ];

  const plugins = [];

  if(options.target === "web") {
    // $FlowOK
    plugins.push(require("babel-plugin-transform-inline-environment-variables"));
  }

  config.module.loaders.push(...loaders);

  config.babel = {
    presets: babelPresets,
    plugins,
  };
}
