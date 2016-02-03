import path from "path";

export function extractEntry(input) {
  // entry=page@node

  let filename, entry, target;

  if (input.indexOf("=") !== -1) {
    let parts = input.split("=");
    entry = parts[0];
    filename = parts[1];
  } else {
    filename = input;

    let ext = path.extname(filename);
    entry = path.basename(filename, ext);
  }

  if (filename.indexOf("@") !== -1) {

    let parts = filename.split("@");

    filename = parts[0];
    target = parts[1];
  }

  if (target == undefined) {
    target = "web";
  }

  return { filename, entry, target };
}