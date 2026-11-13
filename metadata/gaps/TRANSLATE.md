# 把指定缺口译成简体中文

只写分配给你的那一个输出文件。不要改其他文件，不要改计划文件。

输入是一个 JSON 数组，元素为 `{ "module", "key", "english" }`。
输出是一个 JSON 对象：`{ "<module>": { "<key>": "<简体中文>" } }`。输入里的每一条都要出现，且只出现一次。同一条英文在你的文件里必须译成同一句中文。

如果 `metadata/gaps/shared-zh.json` 里有和 `english` 完全相同的键，必须原样使用那个译文，不要改写。

## 词表

- Agent / Agents → 智能体。不要译成代理、助手。
- Chat → 聊天。不要译成对话，除非英文说的是 conversation 而不是 Chat 这个功能。
- 用「你」，不用「您」。
- 这些词保持英文：Cursor、MCP、Claude、Codex、Copilot、Composer、Glass、Airlock、Bugbot、Statsig、SSH、WSL、Git、JSON、URL、CLI、PATH、VS Code、Dev Container 可译为「开发容器」。
- 产品功能名保持英文：Cursor Tab、Cursor Blame、Cursor CLI、Cursor Composer、Cursor AI、Cursor Chimes、Cursor Origin、Cursor Auth、Cursor Orbit。Cursor Settings 译为「Cursor 设置」。
- 小写 cursor / cursors 指编辑器光标，译为「光标」。
- 这句是光标，不是产品名：`Go to Problem at Cursor (Error, Warning, Info)` → `转到光标处的问题（错误、警告、信息）`。
- 大写 Cursor 在其余句子里都是产品名，保留 Cursor，不要写成光标。

## 必须原样保留

- `{0}` `{1}` 这类占位符，个数、数字、写法都不变。
- `$(icon)` 图标记号整段不变。
- `(command:...)` 整段不变。
- Markdown 链接的 URL 不变。链接文字可以翻译。
- 换行数量和位置不变。
- 反引号里的设置 id、命令 id、代码不变，例如 `editor.hover.delay`。

## 加速键

英文里 `&&` 后面的第一个拉丁字母是加速键。中文用官方写法，例如 `&&File` → `文件(&&F)`，`&&Reload Window` → `重新加载窗口(&&R)`。字母保持原字母，通常大写。不要多加或少加 `&&`。

## 文风

对齐 VS Code 简体中文：打开、关闭、删除、保存、取消、设置、工作区、资源管理器、终端、侧边栏、命令面板、键绑定、扩展、调试、断点、源代码管理、提交、分支、撤消、恢复、重新加载、正在、无法、已。
不要把整句英文留在译文里。短标签也要译成中文，专有名词除外。
不要输出解释，只写 JSON 文件。
