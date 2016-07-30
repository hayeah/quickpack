const tty = require("tty");
const ProgressBar = require("progress");

export default function loadModulesWithProgress(modules: string[]): any[] {
  var usingTTY = isTTY();

  var bar: any = usingTTY && new ProgressBar(':bar [(:n/:total) Loading :module]', {
    total: modules.length,
    width: 30,
    clear: true,
  });

  let loadedModules: any[] = [];
  modules.forEach((name, i) => {
    let mod = require(name)
    loadedModules.push(mod);
    if (usingTTY) {
      bar.tick(i, {
        module: name,
        n: i + 1,
      });
    } else {
      console.log("loaded", name);
    }

  });

  return loadedModules;
}

function isTTY() {
  return tty.isatty((process.stdout as any).fd);
}
