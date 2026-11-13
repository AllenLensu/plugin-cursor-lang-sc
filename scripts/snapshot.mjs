import fs from "fs";
import path from "path";
import { loadNls, paths, readJson, root, writeJson } from "./lib.mjs";

const snapshot = loadNls();
const product = readJson(paths.product);
const metadata = {
  cursorVersion: product.version,
  vscodeVersion: product.vscodeVersion,
  commit: product.commit,
  keyCount: snapshot.keyCount,
  messageCount: snapshot.messageCount,
  duplicateCount: snapshot.duplicates.length,
  duplicates: snapshot.duplicates,
  moduleCount: snapshot.order.length,
  order: snapshot.order,
  modules: snapshot.modules,
};

const dest = path.join(root, "upstream", "zh-cn");
fs.rmSync(dest, { recursive: true, force: true });
fs.cpSync(path.join(paths.officialPack, "translations"), dest, { recursive: true });

writeJson(path.join(root, "metadata", "cursor.json"), metadata);

const copied = fs.readdirSync(path.join(dest, "extensions")).filter((name) => name.endsWith(".i18n.json"));
console.log(
  `snapshot ${metadata.cursorVersion} vscode ${metadata.vscodeVersion} keys ${metadata.keyCount} messages ${metadata.messageCount} duplicates ${metadata.duplicateCount} modules ${metadata.moduleCount} extensions ${copied.length}`,
);
