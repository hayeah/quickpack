/* @flow */

import * as path from "path";
const webpack = require("webpack");

import {QuickPackOptions} from "../options";

export type WebpackConfig = any;

type Entries = {
  [key:string]: string
};

import configOutput from "./output";
import configCSS from "./css";
import configBabel from "./babel";
import configExternals from "./externals";
import configResolve from "./resolve";
import configProgressReport from "./progressReport";
import configProduction from "./production";
import configTypeScript from "./typescript";
import configHotReload from "./hot-reload";
import configSourceMap from "./source-map";
import configNode from "./node";
import configStaticResources from "./static-resources";
import configPolyfill from "./polyfill";

export default buildConfig;

export type Target = string;
// "web" | "node";

export function buildConfig(target: Target, entries: Entries, options: QuickPackOptions): WebpackConfig {
  function applyConfigFunctions(...configFunctions) {
    configFunctions.forEach(fn => {
      fn(config,options);
    });
  }

  // TODO add an "export" flag. nodejs target should export automatically.
  let isLibrary = target === "node";

  options = Object.assign({},options,{
    target,
    isLibrary,
    entries,
  });

  const {projectRoot, production} = options;

  const config: WebpackConfig = {
    context: projectRoot,
    target: target,
    entry: entries,

    module: {
      loaders: [],
    },

    plugins: [],
  };

  applyConfigFunctions(
    configOutput,
    configResolve,
    configOutput,
    configSourceMap,

    // ES6. js, jsx
    configBabel,
    configPolyfill,

    // TypeScript. ts, tsx
    configTypeScript,

    configCSS,

    configStaticResources,
    configExternals,
    configProgressReport
  );

  if(options.useServer && target === "web") {
    applyConfigFunctions(configHotReload);
  }

  if(options.useProduction) {
    applyConfigFunctions(configProduction);
  }

  if(options.target === "node") {
    applyConfigFunctions(configNode);
  }

  // Don't output assets if there's compilation error.
  // https://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
  config.plugins.push(new webpack.NoErrorsPlugin());

  return config;
}
