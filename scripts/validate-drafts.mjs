import fs from "fs";
import path from "path";
import { root, sameTokens } from "./lib.mjs";

const partsDir = path.join(root, "metadata", "gaps", "parts");
const srcDir = path.join(root, "src", "zh-cn");
const expected = new Map();
for (const name of fs.readdirSync(partsDir)) {
  if (!name.endsWith(".json")) continue;
  const items = JSON.parse(fs.readFileSync(path.join(partsDir, name), "utf8"));
  for (const item of items) expected.set(`${item.module}\0${item.key}`, item.english);
}

const got = new Map();
const files = fs.readdirSync(srcDir).filter((name) => name.endsWith(".json") && name !== "locked.json");
for (const name of files) {
  const json = JSON.parse(fs.readFileSync(path.join(srcDir, name), "utf8"));
  for (const [mod, bag] of Object.entries(json)) {
    for (const [key, chinese] of Object.entries(bag)) {
      got.set(`${mod}\0${key}`, { chinese, file: name });
    }
  }
}

const missing = [];
const token = [];
const polite = [];
const sameEnglish = new Map();
for (const [id, english] of expected) {
  const hit = got.get(id);
  if (!hit) {
    missing.push(id);
    continue;
  }
  if (!sameTokens(english, hit.chinese)) token.push(`${id} :: ${hit.file}`);
  if (hit.chinese.includes("您")) polite.push(id);
  if (!sameEnglish.has(english)) sameEnglish.set(english, new Map());
  const bucket = sameEnglish.get(english);
  bucket.set(hit.chinese, (bucket.get(hit.chinese) ?? 0) + 1);
}
const extra = [...got.keys()].filter((id) => !expected.has(id) && !id.startsWith("vs/workbench/contrib/mcp/common/mcpConfiguration\0mcp.discovery") && id !== "vs/workbench/contrib/preferences/browser/settingsLayout\0cursor");
const clashes = [];
for (const [english, bucket] of sameEnglish) {
  if (bucket.size > 1) clashes.push(english.slice(0, 80));
}
console.log(JSON.stringify({ expected: expected.size, got: got.size, missing: missing.length, token: token.length, polite: polite.length, clashes: clashes.length, extra: extra.length }, null, 2));
if (missing.length) console.log("MISSING\n" + missing.slice(0, 30).join("\n"));
if (token.length) console.log("TOKEN\n" + token.slice(0, 20).join("\n"));
if (polite.length) console.log("POLITE\n" + polite.slice(0, 10).join("\n"));
if (clashes.length) console.log("CLASH\n" + clashes.slice(0, 15).join("\n"));
if (extra.length) console.log("EXTRA\n" + extra.slice(0, 15).join("\n"));
