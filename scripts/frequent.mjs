import fs from "fs";
import path from "path";
import { root } from "./lib.mjs";

const dir = path.join(root, "metadata", "gaps");
const counts = new Map();
for (const area of ["glass", "workbench", "services", "browser", "other"]) {
  const items = JSON.parse(fs.readFileSync(path.join(dir, `${area}.json`), "utf8"));
  for (const item of items) {
    counts.set(item.english, (counts.get(item.english) ?? 0) + 1);
  }
}
const rows = [...counts.entries()].filter(([, n]) => n >= 2).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
console.log("repeated", rows.length);
for (const [english, n] of rows) {
  if (english.length > 80) continue;
  console.log(`${n}\t${english.replaceAll("\n", "⏎")}`);
}
