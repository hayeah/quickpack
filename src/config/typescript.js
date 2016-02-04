/* @flow */
import type {WebpackConfig, QuickPackOptions} from "../build-config";

export default function configExternals(config:WebpackConfig,options:QuickPackOptions): void {
  // Chaining loaders
  // https://github.com/webpack/webpack/issues/482#issuecomment-56161239
  let loaders = [
    {
      test: /\.tsx?$/,
      // exclude: /(node_modules|bower_components)/,
      loader: 'babel-loader',
    },

    {
      test: /\.tsx?$/,
      loader: 'ts-loader',
      // exclude: /node_modules/,
      query: {
        transpileOnly: true,
        silent: true,
        compilerOptions: {
          module: "commonjs",
          jsx: "react",
          target: "es6",
        },
      },
    },
  ];

  config.module.loaders.push(...loaders);
}
