/* @flow */

export type ArgV = {
  watch: boolean,
  server: boolean,
  uglify: boolean,

  production: boolean,

  _: Array<string>,
}

var yargs = require('yargs')
  .usage('$0 command')
  .command('build', 'Builds the project.')
  .command('setup', 'Copy baked configuration files. [experimental]')
  .version(function() {
    return require('../package').version;
  })
  .alias("v","version")
  .demand(1, 'must provide a valid command'),


  argv = yargs.argv,
  command = argv._[0];

var projectOptions = {
  "project-root": {
    alias: "r",
    describe: "Project root",
    default: process.cwd(),
    type: 'string',
  }
};

var webpackOptions = {
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

    "source-map-type": {
      describe: "source map type",
      default: "cheap-module-eval-source-map",
      type: 'string',
    },

    "library": {
      describe: "Build as CommonJS module",
      default: false,
      type: 'boolean',
    },

    "uglify": {
      describe: "source map (production only)",
      default: true,
      type: 'boolean',
    },
};

if (command === 'build') {
  argv = yargs.reset()
    .usage('$0 build page1=./entry1 page2=./entry2 ...')
    .options({
      w: {
        alias: 'watch',
        describe: "Watch mode",
        default: false,
        type: 'boolean',
      },

      server: {
        describe: "Enable server mode",
        type: 'boolean',
        default: false,
      },

      port: {
        describe: "dev-server port",
        type: 'number',
        default: undefined,
      },

      forward: {
        alias: 'f',
        describe: 'forward to backend server',
        default: undefined,
        type: 'string',
      }

    })
    .options(webpackOptions)
    .help('h')
    .alias("h","help")
    .example("$0 build entry.js", "Build entry.js")
    .example("$0 build entry1.js entry1.js", "Build multiple entries")
    .example("$0 build page2=./entry1.js page2=./entry2.js ", "Multiple entries with output names")
    .example("$0 build server@node", "Build for NodeJS")
    .example("$0 build client@web server@node", "Build for different targets")
    .example("$0 build index.js --server", "Start live-reload server")
    // .example("$0 build index.js --library", "Outout CommonJS module")
    .wrap(yargs.terminalWidth())
    .argv

  // console.log(argv);
  // process.exit(1);

  // $FlowOK
  require("./build")(argv);
} else if (command === 'setup') {
  argv = yargs.reset()
    .usage('$0 setup [tool]...')
    .options({
      f: {
        alias: 'force',
        describe: "Force overwrite config files",
        default: false,
        type: 'boolean',
      },
    })
    .require(1)
    .options(projectOptions)
    .wrap(yargs.terminalWidth())
    .help('h').alias("h","help")
    .example("$0 setup typescript", "Dump TypeScript related config files")
    .argv

  // console.log(argv);
  require("./setup")(argv);
  // process.exit(1);
} else {
  yargs.showHelp();
}
