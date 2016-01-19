#!/usr/bin/env node

var yargs = require('yargs')
  .usage('$0 command')
  .command('build', 'Builds the project.')
  .command('server', 'Start dev server.')
  .demand(1, 'must provide a valid command'),
  argv = yargs.argv,
  command = argv._[0];

var webpackOptions = {
    p: {
      alias: 'production',
      describe: "Build for production environment",
      default: false,
      type: 'boolean',
    },

   "hash": {
      describe: "Enable long-term cache hashing",
      default: false,
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


    })
    .options(webpackOptions)
    .help('h')
    .alias("h","help")
    .argv

  require("../build")(argv);

} else if (command === 'server'){
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
    .alias("h","help").argv
   require("../server")(argv);
} else {
  yargs.showHelp();
}
