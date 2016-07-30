/* @flow */
import * as path from "path";

import {WebpackConfig, QuickPackOptions} from "../options";

export default function config(config: WebpackConfig, options: QuickPackOptions): void {
  // Webpack defines these constants as paths relative to context.
  config.node = {
    __filename: true,
    __dirname: true,
  }

  config.plugins.push(new DirnamePlugin());

  // Doesn't work:
  // config.plugins.push(new webpack.DefinePlugin({
  //   __outdir: "__dirname",
  // }));

  // config.plugins.push(new webpack.DefinePlugin({
  //   __outdir: "eval('__dirname')",
  // }));

}

// Define __moduledir to calculate the equivalent of __dirname relative to output path.
// Webpack Issue: https://github.com/webpack/webpack/issues/2033
function DirnamePlugin() {
}

DirnamePlugin.prototype.apply = function(compiler) {
  compiler.parser.plugin("expression __outputdir", function() {
    this.state.current.addVariable("__outputdir", "__dirname");
  });

  compiler.parser.plugin("expression __moduledir", function() {
    const moduleRelativePathFromContext = path.relative(compiler.context, this.state.module.context);

    const outputDir = "__dirname";
    // TODO: Figoure out the package dir relative to outputdir. Now just assume it to be the parent of outputdir.
    const packageDir = `${outputDir} + '/../'`;

		this.state.current.addVariable("__moduledir", `${packageDir} + ${JSON.stringify(moduleRelativePathFromContext)}`);
		return true;
	});
}
