const ProgressBar = require("progress");

function loadModulesWithProgress(modules) {
  var bar = new ProgressBar(':bar [(:n/:total) Loading :module]', {
    total: modules.length,
    width: 30,
    clear: true,
  });

  var loadedModules = {};
  modules.forEach((name,i) => {
    loadedModules[name] = require(name);
    bar.tick(i,{
      module:name,
      n: i+1,
    });
  });

  return loadedModules;

}

module.exports = function(argv,mode) {


  var hotReloadMode = argv.serverMode === true;

  var deps = [
    "babel-loader",
    'babel-preset-es2015',
    "babel-preset-stage-1",
    'babel-preset-react',
  ];

  // var loadedDeps =
  loadModulesWithProgress(deps);

  var options = {
    presets: removeNulls([
      require('babel-preset-es2015'),
      require("babel-preset-stage-1"),
      require('babel-preset-react'),
    ]),

    plugins: [
    ],

    env: {
      development: {
        presets: removeNulls([
          hotReloadMode && require('babel-preset-react-hmre'),
        ]),
      }
    }
  };

  return options;
}

function removeNulls(array) {
  return array.filter(function(item) {
     return Boolean(item);
  });
}


