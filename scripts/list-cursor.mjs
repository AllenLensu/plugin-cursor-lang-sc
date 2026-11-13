import fs from "fs";
import path from "path";
import { root } from "./lib.mjs";

const dir = path.join(root, "metadata", "gaps");
for (const area of ["glass", "workbench", "services", "browser", "other"]) {
  const items = JSON.parse(fs.readFileSync(path.join(dir, `${area}.json`), "utf8"));
  const hits = items.filter((item) => /\bCursor\b/.test(item.english));
  console.log(`\n## ${area} ${hits.length}`);
  const seen = new Set();
  for (const item of hits) {
    if (seen.has(item.english)) continue;
    seen.add(item.english);
    console.log(item.english.replaceAll("\n", "⏎"));
  }
}
