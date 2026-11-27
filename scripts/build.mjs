import fs from "fs";
import path from "path";
import {
  COPYRIGHT,
  CURSOR_EXTENSIONS,
  loadSnapshot,
  loadUpstreamContents,
  readJson,
  resolveCore,
  resolveExtensions,
  root,
  sameTokens,
  writeJson,
} from "./lib.mjs";
import { writeQuestion } from "./report.mjs";

const snapshot = loadSnapshot();
const upstream = loadUpstreamContents();
const { resolved, unmatched, stats, byEnglish } = resolveCore(snapshot, upstream);
const extensions = resolveExtensions(byEnglish);

const contents = {};
for (const mod of snapshot.order) {
  const bag = {};
  for (const key of Object.keys(snapshot.modules[mod])) {
    const hit = resolved.get(`${mod}\0${key}`);
    if (!hit) continue;
    bag[key] = hit.chinese;
  }
  if (Object.keys(bag).length > 0) contents[mod] = bag;
}

const dist = path.join(root, "dist");
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(path.join(dist, "translations", "extensions"), { recursive: true });
fs.cpSync(path.join(root, "upstream", "zh-cn", "extensions"), path.join(dist, "translations", "extensions"), {
  recursive: true,
});
fs.copyFileSync(path.join(root, "README.md"), path.join(dist, "README.md"));
fs.copyFileSync(path.join(root, "License.txt"), path.join(dist, "License.txt"));

writeJson(path.join(dist, "translations", "main.i18n.json"), {
  "": COPYRIGHT,
  version: snapshot.cursorVersion,
  contents,
});

const extensionIds = fs
  .readdirSync(path.join(dist, "translations", "extensions"))
  .filter((name) => name.endsWith(".i18n.json"))
  .map((name) => name.slice(0, -".i18n.json".length))
  .sort();

for (const item of extensions.translated) {
  writeJson(path.join(dist, "translations", "extensions", `${item.id}.i18n.json`), {
    "": [
      "Cursor Simplified Chinese language pack.",
      "Display strings for this built-in extension.",
    ],
    version: snapshot.cursorVersion,
    contents: { package: item.strings },
  });
  extensionIds.push(item.id);
}

const translations = [
  { id: "vscode", path: "./translations/main.i18n.json" },
  ...extensionIds.map((id) => ({ id, path: `./translations/extensions/${id}.i18n.json` })),
];
const manifest = {
  name: "cursor-lang-zh-hans",
  displayName: "Cursor 简体中文语言包",
  description: "Cursor 的简体中文语言包。没有唯一 VS Code 译法的字符串仍显示英文。",
  version: snapshot.cursorVersion,
  publisher: "allen",
  license: "MIT",
  engines: { vscode: "^1.147.0" },
  categories: ["Language Packs"],
  keywords: ["中文(简体)", "Cursor"],
  contributes: {
    localizations: [
      {
        languageId: "zh-cn",
        languageName: "Chinese Simplified",
        localizedLanguageName: "中文(简体)",
        translations,
      },
    ],
  },
};
writeJson(path.join(dist, "package.json"), manifest);

const tokenMismatches = [];
for (const item of resolved.values()) {
  if (!sameTokens(item.english, item.chinese)) {
    tokenMismatches.push({ ...item, variant: "primary" });
  }
}
for (const dup of snapshot.duplicates ?? []) {
  const item = resolved.get(`${dup.module}\0${dup.key}`);
  if (!item) continue;
  if (!sameTokens(dup.english, item.chinese)) {
    tokenMismatches.push({ ...item, english: dup.english, variant: "duplicate" });
  }
}

writeJson(path.join(root, "metadata", "stats.json"), {
  ...stats,
  tokenMismatches: tokenMismatches.length,
  extensionUnmatched: extensions.unmatched.length,
  cursorExtensions: CURSOR_EXTENSIONS.map(([id]) => id),
});
writeQuestion({ snapshot, upstream, resolved, unmatched, extensions, stats, tokenMismatches });

console.log(JSON.stringify({ ...stats, tokenMismatches: tokenMismatches.length, extensionUnmatched: extensions.unmatched.length }));
