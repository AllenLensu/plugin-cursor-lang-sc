import fs from "fs";
import path from "path";
import { root } from "./lib.mjs";

const items = JSON.parse(fs.readFileSync(path.join(root, "metadata", "gaps", "workbench.json"), "utf8"));
const buckets = [[], [], []];
const mods = [...new Set(items.map((item) => item.module))].sort();
const assign = new Map();
mods.forEach((mod, index) => assign.set(mod, index % 3));
for (const item of items) buckets[assign.get(item.module)].push(item);
buckets.forEach((bucket, index) => {
  const file = path.join(root, "metadata", "gaps", `workbench-${index}.json`);
  fs.writeFileSync(file, JSON.stringify(bucket));
  console.log(index, bucket.length, "modules", new Set(bucket.map((item) => item.module)).size);
});
