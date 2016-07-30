/* @flow */

import prependToEntries from "../prependToEntries";
import {WebpackConfig, QuickPackOptions} from "../options";

export default function config(config: WebpackConfig, options: QuickPackOptions): void {
  if(!options.usePolyfill) {
    return;
  }

  // prepend babel-polyfill to the beginning of each entry.
  config.entry = prependToEntries(config.entry, require.resolve("babel-polyfill"));
}
