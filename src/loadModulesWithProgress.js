/* @flow */

import tty from 'tty';
import ProgressBar from "progress";

export default function loadModulesWithProgress(modules: Array<string>): Array<any> {
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
