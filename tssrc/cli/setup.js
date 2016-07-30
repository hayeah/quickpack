/* @flow */

const fs = require("fs");
const path = require("path");
const mergedirs = require('merge-dirs').default;

import * as argv from "./argv";

type ArgV = argv.Base & argv.Project & {
  force: boolean,
};

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
    .options(argv.project)
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
  const { projectRoot, force } = argv;

  const configDir = path.join(__dirname, "../..", "configFiles", "typescript");

  // The ask option is crappy and horrible. Don't use.
  const conflictResolve = force === true ? "overwrite" : "skip";
  mergedirs(configDir, projectRoot, conflictResolve);

  // Configure VSCode
  let typescriptPath;
  // Uses the TypeScript version bundled with quickpack (bad idea?)
  typescriptPath = path.dirname(require.resolve("typescript"));

  if(typescriptPath) {
    const vscodeSettings = {
      "typescript.tsdk": typescriptPath,
    };

    const w = fs.createWriteStream(path.join(projectRoot,".vscode","settings.json"));
    w.write(JSON.stringify(vscodeSettings, null, 2), function(err) {
      if(err) {
        console.log(err);
      }
    });
  }
}

const setupMap = {
  "typescript": setupTypeScript,
}

function copy(src,dst) {
  fs.createReadStream(src).pipe(fs.createWriteStream(dst));
}
