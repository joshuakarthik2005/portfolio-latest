// Next 16 static export writes segment payloads as nested files
// (e.g. projects/routex/__next.projects/$d$slug/__PAGE__.txt), but the client
// requests the dotted form (projects/routex/__next.projects.$d$slug.__PAGE__.txt).
// Static hosts without rewrites return 404, so mirror each file to the dotted name.
import { readdirSync, statSync, copyFileSync, existsSync } from "node:fs";
import { join, relative, sep } from "node:path";

const OUT = "out";
let copied = 0;

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (!statSync(p).isDirectory()) continue;
    if (name.startsWith("__next.")) flatten(p, dir);
    else if (name !== "_next") walk(p);
  }
}

function flatten(root, parent) {
  const stack = [root];
  while (stack.length) {
    const d = stack.pop();
    for (const name of readdirSync(d)) {
      const p = join(d, name);
      if (statSync(p).isDirectory()) stack.push(p);
      else {
        const dotted = join(parent, relative(parent, p).split(sep).join("."));
        if (!existsSync(dotted)) {
          copyFileSync(p, dotted);
          copied++;
        }
      }
    }
  }
}

walk(OUT);
console.log(`flatten-rsc: mirrored ${copied} segment payload(s)`);
