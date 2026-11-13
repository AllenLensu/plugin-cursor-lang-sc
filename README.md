# Cursor 简体中文语言包

扩展 id：`allen.cursor-lang-zh-hans`。对应 Cursor 3.29.15（VS Code 1.128.0）。包里没有运行时代码，也不改 Cursor 的安装目录。

译文分三层：

1. 官方简体中文语言包 1.128 里，模块和键都对得上的句子。
2. 别的模块有同一个键，而且英文也相同，并且只有一条中文。
3. 英文（只忽略首尾和连续空格）在官方包里恰好只有一条中文。

构建不会卸载官方语言包。

## 安装

1. 先卸载「Chinese (Simplified) Language Pack」（`ms-ceintl.vscode-language-pack-zh-hans`）。两份语言包不能同时接管同一批翻译 id。
2. 安装本扩展的 VSIX。
3. 完全退出 Cursor，再重新打开。只重载窗口不会换语言。

`locale.json` 已经是 `zh-cn`，不用改。

## 仍然会是英文的部分

Cursor Settings、账户页，以及没有放进 `nls.messages.json` 的 Agent / Chat 文案，不在这份语言包的覆盖范围内，会继续显示英文。
