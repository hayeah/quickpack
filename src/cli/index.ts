require('yargs')
  .usage('$0 command')
  .command('build', 'Builds the project.', require("./build"))
  .command('setup', 'Copy baked configuration files. [experimental]', require("./setup"))
  .version(function() {
    return require('../../package').version;
  })
  .help("help")
  .alias("h", "help")
  .alias("v","version")
  .demand(1, 'must provide a valid command').argv;
