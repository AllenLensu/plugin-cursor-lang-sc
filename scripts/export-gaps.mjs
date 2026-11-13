import fs from "fs";
import path from "path";
import { loadSnapshot, loadUpstreamContents, resolveCore, root } from "./lib.mjs";

const FROZEN = new Set([
  "vs/platform/update/common/update.config.contribution\0updateMode",
  "vs/workbench/api/browser/mainThreadAuthentication\0allow",
  "vs/workbench/browser/actions/layoutActions\0toggleEditor",
  "vs/workbench/contrib/debug/browser/debugIcons\0debugAll",
  "vs/workbench/electron-sandbox/actions/installActions\0successIn",
  "vs/workbench/electron-sandbox/actions/installActions\0install",
  "vs/workbench/services/experiment/browser/dynamicConfigOverrideActions\0selectConfig",
  "vs/workbench/services/experiment/browser/experimentOverrideActions\0selectExperiment",
  "vs/workbench/services/experiment/browser/featureFlagOverrideActions\0selectFlag",
  "vs/workbench/services/experiment/browser/featureFlagOverrideActions\0overrideSet",
]);

const snapshot = loadSnapshot();
const { unmatched } = resolveCore(snapshot, loadUpstreamContents());
const dir = path.join(root, "metadata", "gaps");
fs.mkdirSync(dir, { recursive: true });

const byArea = {};
const ambiguous = [];
const frozen = [];
for (const item of unmatched) {
  const id = `${item.module}\0${item.key}`;
  if (FROZEN.has(id)) {
    frozen.push(item);
    continue;
  }
  if (item.candidates.length > 1) {
    ambiguous.push(item);
    continue;
  }
  if (!byArea[item.area]) byArea[item.area] = [];
  byArea[item.area].push({
    module: item.module,
    key: item.key,
    english: item.english,
  });
}

for (const [area, items] of Object.entries(byArea)) {
  fs.writeFileSync(path.join(dir, `${area}.json`), JSON.stringify(items), "utf8");
  const unique = new Set(items.map((item) => item.english));
  const cursor = items.filter((item) => /\bCursor\b/.test(item.english)).length;
  console.log(area, items.length, "unique", unique.size, "cursor", cursor);
}
fs.writeFileSync(path.join(dir, "ambiguous-candidates.json"), JSON.stringify(ambiguous, null, 2), "utf8");
fs.writeFileSync(
  path.join(dir, "frozen.json"),
  JSON.stringify(
    frozen.map((item) => ({ module: item.module, key: item.key, english: item.english })),
    null,
    2,
  ),
  "utf8",
);
console.log("ambiguous", ambiguous.length, "frozen unmatched", frozen.length, "total unmatched", unmatched.length);
