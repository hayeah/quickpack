/* @flow */

import { Entries } from "./processEntries";

export type QuickPackOptions = {
  projectRoot: string,
  sourceMap: boolean,
  sourceMapCheap: boolean,
  sourceMapType: string,
  output: string,
  hash: boolean,
  target: Target,

  entries: Entries,

  production: boolean,

  devServerPort: number,
  forwardServer: string,

  defaultTarget: string,

  isLibrary: boolean,

  useES6: boolean,

  usePolyfill: boolean,
  useProduction: boolean,
  useWatch: boolean,
  useHotReload: boolean,
  useServer: boolean,
  useUglify: boolean,
};

export type Target = "web" | "node";

export type WebpackConfig = any;
