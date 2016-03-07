/* @flow */
import path from "path";

type ParsedEntry = {
  entry: string,
  filename: string,
  target: string,
};

export type Entries = { [entry: string]: string };

type CompilationTargets = { [target: string]: Entries };

export function extractEntry(input: string, defaultTarget: string): ParsedEntry {
  // entry=page@node
  let filename: string, entry: string, target: string;

  if (input.indexOf("@") !== -1) {
    let parts = input.split("@");

    input = parts[0];
    target = parts[1];
  } else {
    target = defaultTarget;
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

// extractEntriesFromArguments("a a=b foo=bar@node c@web")
export function extractEntriesFromArguments(items: Array<string>, defaultTarget: string): CompilationTargets {
  // collect different platforms together.

  // map of compilation targets
  const compilations: CompilationTargets = {};

  items.forEach(arg => {
    const { filename, entry, target } = extractEntry(arg, defaultTarget);

    if(compilations[target] === undefined) {
      compilations[target] = {};
    }

    const entries = compilations[target];
    entries[entry] = filename;
  });


  return compilations;
}
