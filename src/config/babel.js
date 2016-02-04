/* @flow */

import type {WebpackConfig, QuickPackOptions} from "../build-config";
import tty from 'tty';
import ProgressBar from "progress";



function loadModulesWithProgress(modules: Array<string>): Array<any> {
  var usingTTY = isTTY();

  var bar: any = usingTTY && new ProgressBar(':bar [(:n/:total) Loading :module]', {
    total: modules.length,
    width: 30,
    clear: true,
  });

  let loadedModules = [];
  modules.forEach((name,i) => {
    // $FlowOK
    let mod = require(name)
    loadedModules.push(mod);
    if(usingTTY) {
      bar.tick(i,{
        module:name,
        n: i+1,
      });
    } else {
      console.log("loaded",name);
    }

  });

  return loadedModules;
}

function isTTY() {
  // $FlowOK
  return tty.isatty(process.stdout.fd);
}

function loadBabelPluginsWithProgress() {
  const plugins = [
    "babel-loader",
    'babel-preset-es2015',
    "babel-preset-stage-1",
    'babel-preset-react',
  ];

  return loadModulesWithProgress(plugins);
}

export default function configBabel(config: WebpackConfig, options: QuickPackOptions): void {
  const {useHotReload} = options;

  let [babelLoader,...babelPresets] = loadModulesWithProgress([
    "babel-loader", // preload babel-loader
    'babel-preset-es2015',
    "babel-preset-stage-1",
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

    env: {
      development: {
        presets: removeNulls([
          useHotReload &&
          // $FlowOK
          require('babel-preset-react-hmre'),
        ]),
      }
    }
  };
}

function removeNulls(array) {
  return array.filter(function(item) {
     return Boolean(item);
  });
}
