# 还没有译文的字符串，需要你定

自动复用已经做完。下面这些我没有编中文。同一组如果能用一条规则说完，直接给规则就行。

已放进语言包的：
- 官方同模块同键：10935
- 同键且英文相同：84
- 英文完全一致且官方只有一条中文：238
- 手写覆盖：2543
- 仍无译文：0 个核心键，另加 4 条内置扩展显示名

词表（只用于自动复用，没有拿来猜缺口）：Agent / Agents → 智能体，Chat → 聊天。Cursor、MCP、Claude、Codex、Copilot、Composer，以及字面 Glass，保持英文。编辑器光标的「Cursor」我没有改成英文，仍用官方的「光标」，见后面那一问。

多行英文里的换行写成 ⏎。

## 官方译文和当前英文的占位符不一致

这些键用了官方同模块译文，但 `{0}`、`$(icon)` 或 `(command:…)` 和现在的英文对不上。语言包里暂时留着官方句子。要保留，还是换一条？加速键里的 `&&` 不算这个问题。

- `vs/editor/common/standaloneStrings :: chatEditing.navigation`
  英文：Navigate between edits in the editor with navigate previous{0} and next{1} and accept{2}, reject{3} or view the diff{4} for the current change.
  现用官方译文：在编辑器中的编辑之间导航，可导航上一个{0} 和下一个{1}、接受{2}、拒绝{3} 或查看当前更改的差异{4}。接受所有文件中的编辑{5}。

## 同一个键有两段不同英文

语言包一个键只能存一条中文，两处界面会显示同一句。请决定跟哪段英文，或另给一句。

- `vs/platform/update/common/update.config.contribution :: updateMode`
  英文 1：Configure whether you receive automatic updates. Requires a restart after change. The updates are fetched from a Microsoft online service.⏎⏎**⚠️ Warning**: When 'silentlyApplyOnQuit' is selected, updates will be downloaded and applied automatically without prompting. Updates will be applied when you next restart the application.
  英文 2：Configure whether you receive automatic updates. Requires a restart after change. The updates are fetched from a Microsoft online service.
  现用官方译文：Configure whether you receive automatic updates. The updates are fetched from a Microsoft online service.
- `vs/workbench/api/browser/mainThreadAuthentication :: allow`
  英文 1：Allow
  英文 2：&&Allow
  现用官方译文：允许(&&A)
- `vs/workbench/browser/actions/layoutActions :: toggleEditor`
  英文 1：Maximize Chat Size
  英文 2：Toggle Editor Area Visibility
  现用官方译文：切换编辑器区域可见性
- `vs/workbench/contrib/debug/browser/debugIcons :: debugAll`
  英文 1：Icon for the debug function action.
  英文 2：Icon for the debug stop recording action.
  现用官方译文：（没有官方译文）
- `vs/workbench/electron-sandbox/actions/installActions :: successIn`
  英文 1：Shell command '{0}' successfully installed.
  英文 2：Successfully installed {0} in the 'code' command.
  英文 3：Successfully unlinked {0} from the 'code' command.
  现用官方译文：（没有官方译文）
- `vs/workbench/electron-sandbox/actions/installActions :: install`
  英文 1：Install 'code' command
  英文 2：Install '{0}' command
  现用官方译文：（没有官方译文）
- `vs/workbench/services/experiment/browser/dynamicConfigOverrideActions :: selectConfig`
  英文 1：{0} override(s) active. Select a dynamic config to manage:
  英文 2：Select a dynamic config to manage:
  现用官方译文：（没有官方译文）
- `vs/workbench/services/experiment/browser/experimentOverrideActions :: selectExperiment`
  英文 1：{0} override(s) active. Select an experiment to manage:
  英文 2：Select an experiment to manage:
  现用官方译文：（没有官方译文）
- `vs/workbench/services/experiment/browser/featureFlagOverrideActions :: selectFlag`
  英文 1：{0} override(s) active. Select a flag to manage:
  英文 2：Select a flag to manage:
  现用官方译文：（没有官方译文）
- `vs/workbench/services/experiment/browser/featureFlagOverrideActions :: overrideSet`
  英文 1：Feature flag "{0}" overridden to enabled
  英文 2：Feature flag "{0}" overridden to disabled
  现用官方译文：（没有官方译文）

## 已经复用、但和词表不一致

这些留着官方句子。Agent 被官方译成别的东西、或者 Chat / Glass / 产品名没有按词表留下时，列在这里。要覆盖的话直接给句子或规则。

- `vs/workbench/browser/parts/editor/editorGroupWatermark :: watermark.openChat`（英文里的 Agent 没有落到「智能体」）
  英文：New Agent
  现用：打开聊天
- `vs/glass/browser/services/glass-placement-grants-add-folder :: glass.allowedMachines.addFolder.cliTooOld`（英文里的 Agent 没有落到「智能体」）
  英文：Couldn't start a worker for {0}. Its Cursor Agent CLI is too old to keep its key private.
  现用：无法为 {0} 启动工作节点。它的 Cursor Agent CLI 太旧，无法保证密钥私密。
- `vs/glass/browser/contributions/glassRemoteControlStartBlockContribution :: glass.remoteControl.startBlock.cliTooOld`（英文里的 Agent 没有落到「智能体」）
  英文：Remote Control can't start on this computer. Its Cursor Agent CLI is too old to keep its key private, and no newer build is available yet. Remote Control will start once one is.
  现用：远程控制无法在这台计算机上启动。它的 Cursor Agent CLI 太旧，无法保证密钥私密，而且目前还没有更新的版本。一旦有更新的版本，远程控制就会启动。
- `vs/glass/browser/contributions/glassRemoteControlStartBlockContribution :: glass.remoteControl.startBlock.cliOverrideTooOld`（英文里的 Agent 没有落到「智能体」）
  英文：Remote Control can't start on this computer. The Cursor Agent CLI set in CURSOR_AGENT_WORKER_CLI_PATH is too old to keep its key private. Point it at a newer build or unset it.
  现用：远程控制无法在这台计算机上启动。环境变量 CURSOR_AGENT_WORKER_CLI_PATH 所指定的 Cursor Agent CLI 太旧，无法保证密钥私密。请改为指向更新的版本，或取消该设置。

## 大写 Cursor：光标，还是产品名

下面每条英文都有大写 Cursor，官方中文写成了「光标」。编辑器命令（Add Cursor Above 这类）这样是对的。看起来像产品名的，主要是 MCP 发现来源 `Cursor (Global)` 和 `Cursor (Workspace)`。请定一条规则：哪些继续用「光标」，哪些保留英文 Cursor。

英文：Jump to Cursor
- `vs/workbench/contrib/debug/browser/debug.contribution :: jumpToCursor`
- `vs/workbench/contrib/debug/browser/debugCommands :: jumpToCursor`

英文：&&Add Cursor Above
- `vs/editor/contrib/multicursor/browser/multicursor :: miInsertCursorAbove`

英文：A&&dd Cursor Below
- `vs/editor/contrib/multicursor/browser/multicursor :: miInsertCursorBelow`

英文：Add Cursor Above
- `vs/editor/contrib/multicursor/browser/multicursor :: mutlicursor.insertAbove`

英文：Add Cursor Below
- `vs/editor/contrib/multicursor/browser/multicursor :: mutlicursor.insertBelow`

英文：Cell Cursor Page Down
- `vs/workbench/contrib/notebook/browser/contrib/navigation/arrow :: cursorPageDown`

英文：Cell Cursor Page Down Select
- `vs/workbench/contrib/notebook/browser/contrib/navigation/arrow :: cursorPageDownSelect`

英文：Cell Cursor Page Up
- `vs/workbench/contrib/notebook/browser/contrib/navigation/arrow :: cursorPageUp`

英文：Cell Cursor Page Up Select
- `vs/workbench/contrib/notebook/browser/contrib/navigation/arrow :: cursorPageUpSelect`

英文：Cursor added: {0}
- `vs/editor/contrib/multicursor/browser/multicursor :: cursorAdded`

英文：Cursor Redo
- `vs/editor/contrib/cursorUndo/browser/cursorUndo :: cursor.redo`

英文：Cursor Undo
- `vs/editor/contrib/cursorUndo/browser/cursorUndo :: cursor.undo`

英文：Debug Test at Cursor
- `vs/workbench/contrib/testing/browser/testExplorerActions :: testing.debugAtCursor`

英文：Exit Multi Cursor Mode
- `vs/workbench/contrib/notebook/browser/contrib/multicursor/notebookMulticursor :: exitMultiSelection`

英文：Focus Next Cursor
- `vs/editor/contrib/multicursor/browser/multicursor :: mutlicursor.focusNextCursor`

英文：Focus Previous Cursor
- `vs/editor/contrib/multicursor/browser/multicursor :: mutlicursor.focusPreviousCursor`

英文：Follow Cursor
- `vs/workbench/contrib/outline/browser/outlineActions :: followCur`

英文：Go to Problem at Cursor (Error, Warning, Info)
- `vs/editor/contrib/gotoError/browser/gotoError :: markerAction.this.label`

英文：Increase Multi Cursor Limit
- `vs/editor/browser/widget/codeEditor/codeEditorWidget :: goToSetting`

英文：Run Test at Cursor
- `vs/workbench/contrib/testing/browser/testExplorerActions :: testing.runAtCursor`

英文：Run Test at Cursor with Coverage
- `vs/workbench/contrib/testing/browser/testExplorerActions :: testing.coverageAtCursor`

英文：Run to Cursor
- `vs/workbench/contrib/debug/browser/debugEditorActions :: runToCursor`

英文：Select from Anchor to Cursor
- `vs/editor/contrib/anchorSelect/browser/anchorSelect :: selectFromAnchorToCursor`

英文：Switch to Alt+Click for Multi-Cursor
- `vs/workbench/contrib/codeEditor/browser/toggleMultiCursorModifier :: miMultiCursorAlt`

英文：Switch to Cmd+Click for Multi-Cursor
- `vs/workbench/contrib/codeEditor/browser/toggleMultiCursorModifier :: miMultiCursorCmd`

英文：Switch to Ctrl+Click for Multi-Cursor
- `vs/workbench/contrib/codeEditor/browser/toggleMultiCursorModifier :: miMultiCursorCtrl`

英文：Transpose Characters around the Cursor
- `vs/editor/contrib/linesOperations/browser/linesOperations :: editor.transpose`

## 官方译文本身没有汉字

这些不是缺口。VS Code 的中文包也没把它们译成汉字，所以我照原样收了。数字是有多少个键用了同一对英/中。要改再说。

- 17 键：{0} ({1})
- 9 键：{0}: {1}
- 8 键：ID
- 6 键：{0}
- 6 键：{0}, {1} → {0}，{1}
- 4 键：({0})
- 4 键：{0} {1}
- 4 键：{0} Blame
- 4 键：{0}, {1}
- 4 键：None
- 3 键：({0}) {1}
- 3 键：Add Markdown → Markdown
- 2 键：{0} - {1}
- 2 键：{0} ↔ {1}
- 2 键：{0} AI
- 2 键：Alt
- 2 键：CRLF
- 2 键：HTTP
- 2 键：LF
- 2 键：Shift
- 2 键：Super
- 2 键：Windows
- 1 键：[{0}] {1}: {2}
- 1 键：[{0}]: {1}
- 1 键：[Ln {0}-{1}]
- 1 键：[Ln {0}]
- 1 键：{0}⏎⏎ {1}
- 1 键：{0}⏎[{1}] {2} → {0}⏎[{1}] {2}
- 1 键：{0}⏎{1} → {0}⏎{1}
- 1 键：{0} ({1} • {2})
- 1 键：{0} ({1} • {2}) ↔ {3}
- 1 键：{0} ({1} • {2}) ↔ {3} ({4} • {5})
- 1 键：{0} ({1}) ↔ {2} ({3})
- 1 键：{0} (+{1})
- 1 键：{0} {1}, {2} → {0} {1}，{2}
- 1 键：{0} {1}, {2}, {3} → {0} {1}，{2}，{3}
- 1 键：{0} → {1}
- 1 键：{0} ↔ {1} (Replace Preview)
- 1 键：{0} + {1}
- 1 键：{0} Chimes
- 1 键：{0}, {1} {2} → {0}，{1} {2}
- 1 键：{0}, {1}, {2} → {0}，{1}，{2}
- 1 键：{0}: {1}⏎{2}⏎{3}⏎{4} → {0}: {1}⏎{2}⏎{3}⏎{4}
- 1 键：{0}{1} {2}
- 1 键：{0}{1}, {2} {3} → {0}{1}，{2} {3}
- 1 键：{0}/{1}
- 1 键：{0}B → {0} B
- 1 键：{0}GB → {0} GB
- 1 键：{0}KB → {0} KB
- 1 键：{0}MB → {0} MB
- 1 键：{0}TB → {0} TB
- 1 键：&&ToggleSource
- 1 键：CLI
- 1 键：Command
- 1 键：Control
- 1 键：CPU (%)
- 1 键：Ctrl
- 1 键：Cursor
- 1 键：Cursor Auth
- 1 键：Cursor Composer
- 1 键：Cursor Origin
- 1 键：HTTPS
- 1 键：Id: {0} → ID: {0}
- 1 键：Mimetypes
- 1 键：null → Null
- 1 键：Option
- 1 键：Orbit Airlock
- 1 键：OVR
- 1 键：PID
- 1 键：Quick Open
- 1 键：Search loaded scripts by name
- 1 键：Some extensions are disabled because they are configured not to be allowed.
- 1 键：Some extensions are disabled because they are not allowed by your system administrator.
- 1 键：SpaceX Airlock
- 1 键：SSH
- 1 键：Toggle Keyboard Shortcuts Troubleshooting
- 1 键：Url → URL
- 1 键：VSIX
- 1 键：Windsurf
- 1 键：WSL

## 没有唯一官方译法

### Glass（0）

没有。

### 工作台（0）

没有。

### 服务（0）

没有。

### 浏览器层（0）

没有。

### 其他（0）

没有。

### 扩展（6）

这 6 条来自 Cursor 内置扩展的 `package.nls.json`，不在 `nls.messages.json` 里。官方英文没有唯一对应中文。
`cursor-shadow-workspace` 的 package.json 使用了 `%displayName%` 和 `%description%`，语言包能换掉它的显示名。`cursor-always-local` 和 `cursor-retrieval` 的 package.json 写的是英文原文，没有引用这两条 nls，只补翻译 id 不会改变它们现在显示的名字。

- `anysphere.cursor-always-local :: displayName`（package.json 未引用）
  英文：Cursor Always Local
- `anysphere.cursor-always-local :: description`（package.json 未引用）
  英文：Experimentation @ cursor.sh
- `anysphere.cursor-retrieval :: displayName`（package.json 未引用）
  英文：AI Completions
- `anysphere.cursor-retrieval :: description`（package.json 未引用）
  英文：Get completions from a code language model.
