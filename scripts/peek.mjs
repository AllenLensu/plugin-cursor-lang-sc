import fs from "fs";
const items = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
console.log("count", items.length);
const lens = items.map((i) => i.english.length);
lens.sort((a, b) => a - b);
console.log("median", lens[Math.floor(lens.length / 2)], "p90", lens[Math.floor(lens.length * 0.9)], "max", lens.at(-1));
const long = items.filter((i) => i.english.length > 180).length;
console.log("long", long);
for (const item of items.slice(0, 12)) console.log("---", item.english.slice(0, 140).replaceAll("\n", "⏎"));
