# Cursor 简体中文语言包

扩展 id：`allen.cursor-lang-zh-hans`。对应 Cursor 3.32.10（VS Code 1.147.0）。包里没有运行时代码，也不改 Cursor 的安装目录。

译文分三层：

1. 官方简体中文语言包 1.128 里，模块和键都对得上的句子。
2. 别的模块有同一个键，而且英文也相同，并且只有一条中文。
3. 英文（只忽略首尾和连续空格）在官方包里恰好只有一条中文。

词表（只用于自动复用，没有拿来猜缺口）：Agent / Agents → 智能体，Chat → 聊天。Cursor、MCP、Claude、Codex、Copilot、Composer，以及字面 Glass，保持英文。编辑器光标的「Cursor」仍用官方的「光标」。

构建不会卸载官方语言包。没有市场上架命令，本机发布就是打出 VSIX 再安装。

## 打包

仓库根目录没有 `package.json`。`node scripts/build.mjs` 把清单、译文、README、License 写进 `dist/`。

在 `dist` 目录执行：

```
npx --yes @vscode/vsce package --no-dependencies --allow-missing-repository -o ../allen.cursor-lang-zh-hans-3.32.10.vsix
```

VSIX 在仓库根目录：`allen.cursor-lang-zh-hans-3.32.10.vsix`。

## 安装

1. 先卸载「Chinese (Simplified) Language Pack」（`ms-ceintl.vscode-language-pack-zh-hans`）。两份语言包不能同时接管同一批翻译 id。没装就跳过。
2. 安装 VSIX。Windows 上命令是 `cursor.cmd`：

```
cursor --install-extension allen.cursor-lang-zh-hans-3.32.10.vsix
```

装好后扩展是 `allen.cursor-lang-zh-hans`，版本 `3.32.10`。

3. 完全退出 Cursor，再重新打开。只重载窗口不会换语言。

`locale.json` 已经是 `zh-cn`，不用改。

## 仍然会是英文的部分

Cursor Settings、账户页，以及没有放进 `nls.messages.json` 的 Agent / Chat 文案，不在这份语言包的覆盖范围内，会继续显示英文。
