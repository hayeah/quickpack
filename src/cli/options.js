export const project = {
  "project-root": {
    alias: "r",
    describe: "Project root",
    default: process.cwd(),
    type: 'string',
  }
};

export const webpack = {
    production: {
      describe: "Build for production environment",
      default: false,
      type: 'boolean',
    },

    o: {
      alias: 'output',
      describe: "Output directory",
      default: "build",
      type: 'string',
    },

  //  "hash": {
  //     describe: "Enable long-term cache hashing",
  //     default: false,
  //     type: 'boolean',
  //   },

    "source-map": {
      describe: "source map (dev only)",
      default: true,
      type: 'boolean',
    },

    "source-map-cheap": {
      describe: "uses cheap-module-eval-source-map",
      default: false,
      type: 'boolean'
    },

    "source-map-type": {
      describe: "source map type",
      default: undefined,
      type: 'string',
    },

    "es6": {
      describe: "Output ES6 for modern JS engines",
      type: 'boolean',
      default: undefined,
    },

    "polyfill": {
      describe: "Use ES6 babel-polyfill for max compatibility",
      type: 'boolean',
      default: undefined,
    },

    "uglify": {
      describe: "source map (production only)",
      default: true,
      type: 'boolean',
    },

    "target": {
      describe: "Default compilation target (default 'web')",
      default: undefined,
      type: 'string',
    },
};
