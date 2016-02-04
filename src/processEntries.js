import path from "path";

export function extractEntry(input) {
  // entry=page@node
  let filename, entry, target;

  if (input.indexOf("@") !== -1) {
    let parts = input.split("@");

    input = parts[0];
    target = parts[1];
  }

  if (target == undefined) {
    target = "web";
  }

  if (input.indexOf("=") !== -1) {
    let parts = input.split("=");
    entry = parts[0];
    filename = parts[1];
  } else {
    filename = input;

    let ext = path.extname(filename);
    entry = path.basename(filename, ext);
  }

  if(filename === "") {
    let err = new Error(`filename cannot be empty: ${input}`);
    throw err;
  }

  return { filename, entry, target };
}

// a a=b foo=bar@node c@web
export function extractEntriesFromArguments(argv) {
  // collect different platforms together.

  // map of compilation targets
  let compilations = {
    // [target]: {[entry]: [filename]}
  };

  argv.forEach(arg => {
    const { filename, entry, target } = extractEntry(arg);

    if(compilations[target] === undefined) {
      compilations[target] = {};
    }

    const entries = compilations[target];
    entries[entry] = filename;
  });


  return compilations;
}