/* @flow */

import type {QuickPackOptions} from "./build-config";
import tty from 'tty';
import ProgressBar from "progress";

function loadModulesWithProgress(modules: Array<string>): void {
  var usingTTY = isTTY();

  var bar: any = usingTTY && new ProgressBar(':bar [(:n/:total) Loading :module]', {
    total: modules.length,
    width: 30,
    clear: true,
  });

  var loadedModules = {};
  modules.forEach((name,i) => {
    // $FlowOK
    loadedModules[name] = require(name);
    if(usingTTY) {
      bar.tick(i,{
        module:name,
        n: i+1,
      });
    } else {
      console.log("loaded",name);
    }

  });

  // return loadedModules;
}

function isTTY() {
  // $FlowOK
  return tty.isatty(process.stdout.fd);
}

export function configBabel(options: QuickPackOptions): void {
  const {useHotReload} = options;

  var deps = [
    "babel-loader",
    'babel-preset-es2015',
    "babel-preset-stage-1",
    'babel-preset-react',
  ];

  // var loadedDeps =
  loadModulesWithProgress(deps);

  var options = {
    presets: removeNulls([
      // $FlowOK
      require('babel-preset-es2015'),
      // $FlowOK
      require("babel-preset-stage-1"),
      // $FlowOK
      require('babel-preset-react'),
    ]),

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
