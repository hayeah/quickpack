/* @flow */

import {WebpackConfig, QuickPackOptions} from "../options";
import * as path from "path";
import * as fs from "fs";

export default function configExternals(config:WebpackConfig,options:QuickPackOptions): void {
  if(options.target !== "node") {
    return;
  }

  const { projectRoot, entries } = options;

  config.externals = [suppressGlobalRequire];


  function suppressGlobalRequire(context, request, callback) {
    // console.log("request", context, request);
    for(let key of Object.keys(entries)) {
      const entry = entries[key];
      if(entry === request) {
        callback();
        return;
      }
    }

    const c1 = request.charAt(0);
    if(c1 !== "." && request !== "index.ts") {
      const dep = "commonjs " + request;
      callback(null, dep);
    } else {
      callback();
    }
  }
}
