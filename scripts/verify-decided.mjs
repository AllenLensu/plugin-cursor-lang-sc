import fs from "fs";
import path from "path";
import { loadSnapshot, multiEnglishKeyIds, root, sameTokens } from "./lib.mjs";

const snapshot = loadSnapshot();
const decided = JSON.parse(fs.readFileSync(path.join(root, "src", "zh-cn", "decided.json"), "utf8"));
for (const [mod, bag] of Object.entries(decided)) {
  for (const [key, zh] of Object.entries(bag)) {
    const en = snapshot.modules[mod]?.[key];
    if (en == null) {
      console.log("MISSING KEY", mod, key);
      continue;
    }
    if (!sameTokens(en, zh)) {
      console.log("TOK", mod, key);
      console.log("EN", JSON.stringify(en));
      console.log("ZH", JSON.stringify(zh));
    }
  }
}
const omitted = [...multiEnglishKeyIds(snapshot)];
console.log("omitted", omitted.length);
for (const id of omitted) console.log(id.replace("\0", " :: "));
