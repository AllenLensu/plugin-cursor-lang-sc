import fs from "fs";
import path from "path";
import { areaLabel, normWs, root } from "./lib.mjs";

const AREA_ORDER = ["glass", "workbench", "services", "browser", "other"];
const PRIORITY_WORDS = ["Glass", "Composer", "Claude", "Codex", "Copilot", "MCP", "Agents", "Agent", "Chat", "Cursor"];
const STOP = new Set(
  "The This That With From Your You Are For And Not When Have Has Will Can All New Open Show Hide Toggle Click Select Enable Disable Please File View Code Mode Window Panel Only Into Over After Before About There Their They Was Were Been Being Would Should Could Does Did Done Each Other Some Any More Most Than Then Them Also Just Like Using Used Use Via Per Its Our Who What Which While Where Here Once Still Already Again Back Next Left Right True False Null Default Active Current Local Remote Editor Settings Workbench Command Control Action Actions Button Title Description Label Name Type Value Text Line Lines Error Warning Info Message Messages Change Changes Update Updates".split(
    " ",
  ),
);

function show(english) {
  return english.replaceAll("\r\n", "\n").replaceAll("\n", "⏎");
}

function wordsOf(english) {
  return [...english.matchAll(/[A-Za-z]+(?:'[A-Za-z]+)?/g)].map((match) => match[0]);
}

function templateOf(english) {
  return normWs(english)
    .replace(/\$\([^)]+\)/g, "$(icon)")
    .replace(/\(command:[^)]+\)/g, "(command)")
    .replace(/\{\d+\}/g, "{n}")
    .replace(/\d+/g, "#");
}

function groupByEnglish(items) {
  const map = new Map();
  for (const item of items) {
    if (!map.has(item.english)) map.set(item.english, []);
    map.get(item.english).push(item);
  }
  return [...map.entries()].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]));
}

function writeLocations(lines, items) {
  for (const item of items) lines.push(`- \`${item.module} :: ${item.key}\``);
}

function writeEnglishGroups(lines, items) {
  for (const [english, group] of groupByEnglish(items)) {
    lines.push(`英文：${show(english)}`);
    if (group[0].candidates?.length > 1) {
      lines.push("官方候选（没有代选）：");
      for (const candidate of group[0].candidates) {
        lines.push(
          `- 「${show(candidate.chinese)}」—— ${candidate.count} 处，例如 \`${candidate.example.module} :: ${candidate.example.key}\``,
        );
      }
    }
    writeLocations(lines, group);
    lines.push("");
  }
}

function cluster(items) {
  const ambiguous = items.filter((item) => item.candidates.length > 1);
  const plain = items.filter((item) => item.candidates.length <= 1);
  const used = new Set();
  const termClusters = [];

  const take = (word, minimum) => {
    const pattern = new RegExp(`\\b${word}\\b`);
    const group = plain.filter((item) => !used.has(item) && pattern.test(item.english));
    if (group.length < minimum) return;
    for (const item of group) used.add(item);
    termClusters.push({ word, items: group });
  };

  for (const word of PRIORITY_WORDS) take(word, 2);

  const freq = new Map();
  for (const item of plain) {
    if (used.has(item)) continue;
    for (const word of new Set(wordsOf(item.english))) {
      if (word.length < 4 || STOP.has(word) || !/^[A-Z]/.test(word)) continue;
      freq.set(word, (freq.get(word) ?? 0) + 1);
    }
  }
  const dynamic = [...freq.entries()].filter(([, count]) => count >= 6).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  for (const [word] of dynamic) take(word, 6);

  const rest = plain.filter((item) => !used.has(item));
  const identical = [];
  const singles = [];
  for (const [english, group] of groupByEnglish(rest)) {
    if (group.length >= 2) identical.push({ english, items: group });
    else singles.push(group[0]);
  }

  const byTemplate = new Map();
  for (const item of singles) {
    const template = templateOf(item.english);
    if (!byTemplate.has(template)) byTemplate.set(template, []);
    byTemplate.get(template).push(item);
  }
  const templates = [];
  const alone = [];
  for (const [template, group] of byTemplate) {
    if (group.length >= 2 && group.some((item) => template !== normWs(item.english))) templates.push({ template, items: group });
    else alone.push(...group);
  }
  templates.sort((a, b) => b.items.length - a.items.length);
  alone.sort((a, b) => a.english.localeCompare(b.english) || a.module.localeCompare(b.module));
  return { ambiguous, termClusters, identical, templates, alone };
}

function cursorCaretRows(resolved) {
  const rows = [];
  for (const item of resolved.values()) {
    if (!/\bCursor\b/.test(item.english)) continue;
    if (!item.chinese.includes("光标")) continue;
    rows.push(item);
  }
  rows.sort((a, b) => a.english.localeCompare(b.english) || a.mod.localeCompare(b.mod));
  return rows;
}

function glossaryRows(resolved) {
  const rows = [];
  for (const item of resolved.values()) {
    const reasons = [];
    if (/\bAgents?\b/.test(item.english) && !item.chinese.includes("智能体")) reasons.push("英文里的 Agent 没有落到「智能体」");
    if (/\bChat\b/.test(item.english) && !item.chinese.includes("聊天")) reasons.push("英文里的 Chat 没有落到「聊天」");
    for (const name of ["Glass", "Claude", "Codex", "Copilot", "Composer", "MCP"]) {
      if (new RegExp(`\\b${name}\\b`).test(item.english) && !item.chinese.includes(name)) {
        reasons.push(`英文里的 ${name} 没有保留`);
      }
    }
    if (reasons.length === 0) continue;
    rows.push({ ...item, reasons });
  }
  return rows;
}

function keptLatin(resolved) {
  const map = new Map();
  for (const item of resolved.values()) {
    if (/[\u4e00-\u9fff]/.test(item.chinese)) continue;
    const signature = `${item.english}\0${item.chinese}`;
    if (!map.has(signature)) map.set(signature, { english: item.english, chinese: item.chinese, count: 0 });
    map.get(signature).count += 1;
  }
  return [...map.values()].sort((a, b) => b.count - a.count || a.english.localeCompare(b.english));
}

export function writeQuestion({ snapshot, upstream, resolved, unmatched, extensions, stats, tokenMismatches }) {
  const lines = [];
  lines.push("# 还没有译文的字符串，需要你定");
  lines.push("");
  lines.push("自动复用已经做完。下面这些我没有编中文。同一组如果能用一条规则说完，直接给规则就行。");
  lines.push("");
  lines.push("已放进语言包的：");
  lines.push(`- 官方同模块同键：${stats.baseline}`);
  lines.push(`- 同键且英文相同：${stats.sameKey}`);
  lines.push(`- 英文完全一致且官方只有一条中文：${stats.englishText}`);
  lines.push(`- 手写覆盖：${stats.authored}`);
  lines.push(`- 仍无译文：${stats.unmatched} 个核心键，另加 ${extensions.unmatched.length} 条内置扩展显示名`);
  lines.push("");
  lines.push("词表（只用于自动复用，没有拿来猜缺口）：Agent / Agents → 智能体，Chat → 聊天。Cursor、MCP、Claude、Codex、Copilot、Composer，以及字面 Glass，保持英文。编辑器光标的「Cursor」我没有改成英文，仍用官方的「光标」，见后面那一问。");
  lines.push("");
  lines.push("多行英文里的换行写成 ⏎。");
  lines.push("");

  lines.push("## 官方译文和当前英文的占位符不一致");
  lines.push("");
  lines.push("这些键用了官方同模块译文，但 `{0}`、`$(icon)` 或 `(command:…)` 和现在的英文对不上。语言包里暂时留着官方句子。要保留，还是换一条？加速键里的 `&&` 不算这个问题。");
  lines.push("");
  if (tokenMismatches.length === 0) lines.push("没有。");
  for (const item of tokenMismatches) {
    lines.push(`- \`${item.mod} :: ${item.key}\`${item.variant === "duplicate" ? "（同一键的另一段英文）" : ""}`);
    lines.push(`  英文：${show(item.english)}`);
    lines.push(`  现用官方译文：${show(item.chinese)}`);
  }
  lines.push("");

  lines.push("## 同一个键有两段不同英文");
  lines.push("");
  lines.push("语言包一个键只能存一条中文，两处界面会显示同一句。请决定跟哪段英文，或另给一句。");
  lines.push("");
  const duplicateGroups = new Map();
  for (const dup of snapshot.duplicates ?? []) {
    const id = `${dup.module}\0${dup.key}`;
    if (!duplicateGroups.has(id)) {
      duplicateGroups.set(id, {
        module: dup.module,
        key: dup.key,
        english: [snapshot.modules[dup.module][dup.key]],
      });
    }
    duplicateGroups.get(id).english.push(dup.english);
  }
  for (const group of duplicateGroups.values()) {
    const chinese = upstream[group.module]?.[group.key];
    lines.push(`- \`${group.module} :: ${group.key}\``);
    group.english.forEach((english, index) => lines.push(`  英文 ${index + 1}：${show(english)}`));
    lines.push(`  现用官方译文：${chinese == null ? "（没有官方译文）" : show(chinese)}`);
  }
  lines.push("");

  const duplicateIds = new Set((snapshot.duplicates ?? []).map((item) => `${item.module}\0${item.key}`));
  const conflicts = glossaryRows(resolved).filter((item) => !duplicateIds.has(`${item.mod}\0${item.key}`));
  lines.push("## 已经复用、但和词表不一致");
  lines.push("");
  lines.push("这些留着官方句子。Agent 被官方译成别的东西、或者 Chat / Glass / 产品名没有按词表留下时，列在这里。要覆盖的话直接给句子或规则。");
  lines.push("");
  if (conflicts.length === 0) lines.push("没有。");
  for (const item of conflicts) {
    lines.push(`- \`${item.mod} :: ${item.key}\`（${item.reasons.join("；")}）`);
    lines.push(`  英文：${show(item.english)}`);
    lines.push(`  现用：${show(item.chinese)}`);
  }
  lines.push("");

  const carets = cursorCaretRows(resolved);
  lines.push("## 大写 Cursor：光标，还是产品名");
  lines.push("");
  lines.push("下面每条英文都有大写 Cursor，官方中文写成了「光标」。编辑器命令（Add Cursor Above 这类）这样是对的。看起来像产品名的，主要是 MCP 发现来源 `Cursor (Global)` 和 `Cursor (Workspace)`。请定一条规则：哪些继续用「光标」，哪些保留英文 Cursor。");
  lines.push("");
  writeEnglishGroups(
    lines,
    carets.map((item) => ({ module: item.mod, key: item.key, english: item.english, candidates: [] })),
  );

  const latin = keptLatin(resolved);
  lines.push("## 官方译文本身没有汉字");
  lines.push("");
  lines.push("这些不是缺口。VS Code 的中文包也没把它们译成汉字，所以我照原样收了。数字是有多少个键用了同一对英/中。要改再说。");
  lines.push("");
  for (const item of latin) {
    const same = item.english === item.chinese ? "" : ` → ${show(item.chinese)}`;
    lines.push(`- ${item.count} 键：${show(item.english)}${same}`);
  }
  lines.push("");

  lines.push("## 没有唯一官方译法");
  lines.push("");
  for (const area of AREA_ORDER) {
    const items = unmatched.filter((item) => item.area === area);
    lines.push(`### ${areaLabel(area)}（${items.length}）`);
    lines.push("");
    if (items.length === 0) {
      lines.push("没有。");
      lines.push("");
      continue;
    }
    const clustered = cluster(items);
    if (clustered.ambiguous.length > 0) {
      lines.push(`#### 同一英文有多条官方中文（${clustered.ambiguous.length}）`);
      lines.push("");
      writeEnglishGroups(lines, clustered.ambiguous);
    }
    for (const term of clustered.termClusters) {
      lines.push(`#### 反复出现的词 ${term.word}（${term.items.length}）`);
      lines.push("");
      lines.push(`这些句子都含 ${term.word}，而且没有唯一的官方中文。可以按这个词给一条规则，也可以逐句改。`);
      lines.push("");
      writeEnglishGroups(lines, term.items);
    }
    if (clustered.identical.length > 0) {
      lines.push(`#### 同一句英文出现多次（${clustered.identical.reduce((sum, group) => sum + group.items.length, 0)}）`);
      lines.push("");
      for (const group of clustered.identical) {
        lines.push(`英文：${show(group.english)}`);
        writeLocations(lines, group.items);
        lines.push("");
      }
    }
    if (clustered.templates.length > 0) {
      lines.push(`#### 只差占位符或数字（${clustered.templates.reduce((sum, group) => sum + group.items.length, 0)}）`);
      lines.push("");
      for (const group of clustered.templates) {
        lines.push(`模板：${show(group.template)}`);
        for (const item of group.items) {
          lines.push(`- \`${item.module} :: ${item.key}\``);
          lines.push(`  英文：${show(item.english)}`);
        }
        lines.push("");
      }
    }
    if (clustered.alone.length > 0) {
      lines.push(`#### 其余（${clustered.alone.length}）`);
      lines.push("");
      for (const item of clustered.alone) {
        lines.push(`- \`${item.module} :: ${item.key}\``);
        lines.push(`  英文：${show(item.english)}`);
      }
      lines.push("");
    }
  }

  lines.push("### 扩展（6）");
  lines.push("");
  lines.push("这 6 条来自 Cursor 内置扩展的 `package.nls.json`，不在 `nls.messages.json` 里。官方英文没有唯一对应中文。");
  lines.push("`cursor-shadow-workspace` 的 package.json 使用了 `%displayName%` 和 `%description%`，语言包能换掉它的显示名。`cursor-always-local` 和 `cursor-retrieval` 的 package.json 写的是英文原文，没有引用这两条 nls，只补翻译 id 不会改变它们现在显示的名字。");
  lines.push("");
  for (const item of extensions.unmatched) {
    lines.push(`- \`${item.id} :: ${item.key}\`${item.referenced ? "" : "（package.json 未引用）"}`);
    lines.push(`  英文：${show(item.english)}`);
    if (item.candidates.length > 1) {
      for (const candidate of item.candidates) {
        lines.push(`  候选：${show(candidate.chinese)}（${candidate.count}）`);
      }
    }
  }
  lines.push("");

  const file = path.join(root, "metadata", "unmatched.md");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, lines.join("\n"), "utf8");
  return file;
}
