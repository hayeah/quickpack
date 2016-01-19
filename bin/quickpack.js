#!/usr/bin/env node

var yargs = require('yargs')
  .usage('$0 command')
  .command('build', 'Builds the project.')
  .command('server', 'Start dev server.')
  .demand(1, 'must provide a valid command'),
  argv = yargs.argv,
  command = argv._[0];

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

      p: {
        alias: 'production',
        describe: "Build for production environment",
        default: false,
        type: 'boolean',
      },

      "no-hash": {
        describe: "Disable long-term cache hashing",
        default: true,
        type: 'boolean',
      },
    })
    .help('h')
    .alias("h","help")
    .argv

  console.log(argv);
  require("../build")(argv);
  // console.log('hello!',argv);
} else if (command === 'server'){
  console.log('server');
} else {
  yargs.showHelp();
}
