import path from "path";
import {
  MENUBAR_MODULE,
  MENUBAR_SOURCE_MODULE,
  loadNls,
  loadSnapshot,
  loadUpstreamContents,
  multiEnglishKeyIds,
  readJson,
  resolveCore,
  root,
  sameTokens,
} from "./lib.mjs";

// Official Chinese for this key still contains {5}; the current English does not.
const ALLOWED_PLACEHOLDER_MISMATCH = new Set([
  "vs/editor/common/standaloneStrings\0chatEditing.navigation",
]);

const snapshot = loadSnapshot();
const live = loadNls();
const failures = [];

if (live.keyCount !== snapshot.keyCount || live.messageCount !== snapshot.messageCount) {
  failures.push(
    `snapshot is stale (pinned ${snapshot.keyCount} keys / ${snapshot.messageCount} messages, installed Cursor has ${live.keyCount} / ${live.messageCount}). Run node scripts/snapshot.mjs.`,
  );
}

const upstream = loadUpstreamContents();
const { resolved, unmatched, stats } = resolveCore(snapshot, upstream);
const built = readJson(path.join(root, "dist", "translations", "main.i18n.json"));
const omittedIds = multiEnglishKeyIds(snapshot);

for (const id of omittedIds) {
  const splitAt = id.indexOf("\0");
  const mod = id.slice(0, splitAt);
  const key = id.slice(splitAt + 1);
  if (typeof built.contents?.[mod]?.[key] === "string") {
    failures.push(`multi-English key was included: ${mod}#${key}`);
  }
}

for (const item of resolved.values()) {
  const got = built.contents?.[item.mod]?.[item.key];
  if (got !== item.chinese) {
    failures.push(`built translation missing or different: ${item.mod}#${item.key}`);
  }
  const id = `${item.mod}\0${item.key}`;
  if (!sameTokens(item.english, item.chinese) && !ALLOWED_PLACEHOLDER_MISMATCH.has(id)) {
    failures.push(`placeholders/icons/command links differ: ${item.mod}#${item.key}`);
  }
}

const keptModule = "vs/editor/common/standaloneStrings";
const keptKey = "chatEditing.navigation";
if (built.contents?.[keptModule]?.[keptKey] !== upstream[keptModule]?.[keptKey]) {
  failures.push(`${keptModule}#${keptKey} was rewritten; the official Chinese must stay`);
}

for (const item of unmatched) {
  const got = built.contents?.[item.module]?.[item.key];
  if (typeof got === "string") {
    failures.push(`unmatched key was filled: ${item.module}#${item.key}`);
  }
  failures.push(`no Chinese for ${item.module}#${item.key}`);
}

const mFile = built.contents?.[MENUBAR_MODULE]?.mFile;
const expected = upstream[MENUBAR_SOURCE_MODULE]?.mFile;
if (mFile !== expected || !String(mFile).includes("文件")) {
  failures.push(
    `menubarControl mFile is ${JSON.stringify(mFile)}, expected the reused ${JSON.stringify(expected)}`,
  );
}

console.log(
  JSON.stringify({
    baseline: stats.baseline,
    sameKey: stats.sameKey,
    englishText: stats.englishText,
    authored: stats.authored,
    unmatched: stats.unmatched,
    omitted: stats.omitted,
    glossary: stats.glossary,
  }),
);
console.log(`check failures: ${failures.length}`);
if (failures.length > 0) {
  const preview = failures.slice(0, 25);
  console.log(preview.join("\n"));
  if (failures.length > preview.length) console.log(`... ${failures.length - preview.length} more`);
  process.exitCode = 1;
}
