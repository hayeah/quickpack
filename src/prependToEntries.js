/* @flow */

type Modules = string | Array<string>;

type Entries = {
  [key: string]: Modules,
}

// Prepend a module to the beginning of a list of modules.
export default function prependToEntries(entries: Entries, module: string): Entries {
  console.log(entries, module);
  let newEntries: Entries = {};

  Object.keys(entries).forEach(name => {
    const modules = entries[name];
    newEntries[name] = prependEntry(module, modules);
  });

  return newEntries;
}

// function mapEntries(entries: Entries, fn: (modules: Modules) => Modules): Entries {
//   let newEntries: Entries = {};
//
//   Object.keys(entries).forEach(name => {
//     const modules = newEntries[name];
//     newEntries[name] = fn(modules);
//   });
//
//   return newEntries;
// }

// An entry could be a string or an array. Massage it here.
function prependEntry(module: string, modules: Modules): Array<string> {
  if(typeof modules === "string") {
    return [module, modules];
  } else {
    return [module, ...modules];
  }
}
