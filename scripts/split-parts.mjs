import fs from "fs";
import path from "path";
import { root } from "./lib.mjs";

const dir = path.join(root, "metadata", "gaps");
const out = path.join(dir, "parts");
fs.mkdirSync(out, { recursive: true });
const plan = [
  ["glass", 3],
  ["workbench", 4],
  ["services", 2],
  ["browser", 1],
  ["other", 1],
];
for (const [area, parts] of plan) {
  const items = JSON.parse(fs.readFileSync(path.join(dir, `${area}.json`), "utf8"));
  const size = Math.ceil(items.length / parts);
  for (let i = 0; i < parts; i++) {
    const slice = items.slice(i * size, (i + 1) * size);
    const name = `${area}-${i}`;
    fs.writeFileSync(path.join(out, `${name}.json`), JSON.stringify(slice));
    console.log(name, slice.length);
  }
}
