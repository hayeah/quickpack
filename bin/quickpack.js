#!/usr/bin/env node

var yargs = require('yargs')
  .usage('$0 command')
  .command('build', 'Builds the project.')
  .command('server', 'Start dev server.')
  .command('setup', 'Copy baked configuration files. [experimental]')
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
    p: {
      alias: 'production',
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

   "hash": {
      describe: "Enable long-term cache hashing",
      default: false,
      type: 'boolean',
    },

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

      t: {
        alias: 'target',
        describe: "Target platform",
        default: 'web',
        type: 'string',
      },


    })
    .options(webpackOptions)
    .help('h')
    .alias("h","help")
    .example("$0 build entry.js", "Build entry.js")
    .example("$0 build entry1.js entry1.js", "Build multiple entries")
    .example("$0 build page2=./entry1.js page2=./entry2.js ", "Multiple entries with output names")
    .example("$0 build index.js --target=node", "Build for NodeJS")
    .example("$0 build index.js --library", "Outout CommonJS module")
    .wrap(yargs.terminalWidth())
    .argv

  // console.log(argv);
  // process.exit(1);
  require("../build")(argv);

} else if (command === 'server') {
  argv = yargs.reset()
    .usage('$0 server')
    .options({
      port: {
        describe: 'port number',
        default: 8000,
        type: 'number',
      }
    })
    .options(webpackOptions)
    .help('h')
    .example("PORT=4321 $0 server", "use ENV to specify port")
    .alias("h","help")
    .wrap(yargs.terminalWidth())
    .argv
   require("../server")(argv);
} else if (command === 'setup') {
  argv = yargs.reset()
    .usage('$0 setup')
    .options({
      f: {
        alias: 'force',
        describe: "Force overwrite config files",
        default: false,
        type: 'boolean',
      },
    })
    .options(projectOptions)
    .wrap(yargs.terminalWidth())
    .help('h').alias("h","help")
    .argv

  // console.log(argv);
  require("../setup")(argv);
  // process.exit(1);
} else {
  yargs.showHelp();
}
