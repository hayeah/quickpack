/* @flow */

const fs = require("fs");
const path = require("path");
const mergedirs = require('merge-dirs').default;

import * as options from "./options";

type ArgV = {
  projectRoot: string,
  force: boolean,
  _: Array<string>,
}

export function builder(yargs: any): any {
  return yargs
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
    .options(options.project)
    .help('h').alias("h","help")
    .wrap(yargs.terminalWidth())
    .example("$0 setup typescript", "Dump TypeScript related config files")
  ;
}

export function handler(argv: ArgV) {
  var tools = argv._.slice(1);

  tools.forEach(tool => {
    var setup = setupMap[tool];
    if(setup) {
      setup(argv);
    } else {
      console.log("Unsupported tool:",tool);
    }
  });

}

function setupTypeScript(argv: ArgV) {
  var projectRoot = argv.projectRoot;

  var configDir = path.join(__dirname,"..","configFiles","typescript");

  // The ask option is crappy and horrible. Don't use.
  var conflictResolve = argv.force === true ? "overwrite" : "skip";
  mergedirs(configDir, projectRoot, conflictResolve);

  // Configure VSCode
  var typescriptPath;
  // Uses the TypeScript version bundled with quickpack (bad idea?)
  typescriptPath = path.dirname(require.resolve("typescript"));

  if(typescriptPath) {
    var vscodeSettings = {
      "typescript.tsdk": typescriptPath,
    };

    var w = fs.createWriteStream(path.join(projectRoot,".vscode","settings.json"));
    w.write(JSON.stringify(vscodeSettings,null,2),function(err) {
      if(err) {
        console.log(err);
      }
    });
  }
}

var setupMap = {
  "typescript": setupTypeScript,
}

function copy(src,dst) {
  fs.createReadStream(src).pipe(fs.createWriteStream(dst));
}
