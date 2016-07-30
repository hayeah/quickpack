/* @flow */
import {WebpackConfig, QuickPackOptions} from "../options";

const ProgressPlugin = require("webpack/lib/ProgressPlugin");
const ProgressBar = require("progress");


export default function configProgressReport(config: WebpackConfig): void {
  let progressBar = new ProgressBar("[:msg] :bar",{
    width: 50,
    total: 100,
  });

  let progressPlugin = new ProgressPlugin(function(percentage, msg) {
    progressBar.update(percentage,{msg: msg || "done"});
    if(percentage == 1) {
      progressBar.terminate();
    }
    // console.log(percentage,msg);
  });

  config.plugins.push(progressPlugin);
}
