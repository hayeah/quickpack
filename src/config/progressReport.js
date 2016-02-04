/* @flow */
import type {WebpackConfig, QuickPackOptions} from "../build-config";

import ProgressPlugin from "webpack/lib/ProgressPlugin";
import ProgressBar from "progress";

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
