# kumo-date-picker/
> L2 | 父级: /src/components/ui/vendor/CLAUDE.md

成员清单
index.js: DatePicker 稳定入口，屏蔽上游 dist hash 文件名，向 `kumo.jsx` 暴露单一导出面
date-picker-runtime.js: 上游 DatePicker 主运行时快照，实际承载 restartable range 选择与 `onRangeComplete`
cn.js: DatePicker 运行时依赖的最小 `cn`/随机 id 工具快照
vendor-styling.js: `cn.js` 依赖的底层 class merge 运行时快照

架构决策
此目录固定来源于 `/Users/luo/Desktop/ClaudeCode/oss/kumo` commit `72433e38914eee652c65506c6165582450f0a1d7` 的 dist 产物。允许的本地改动只有三类：稳定文件名、相对 import 路径、来源/删除条件注释。任何运行时逻辑改写都会把桥接层变成分叉实现，这是要避免的。

删除条件
当 npm `@cloudflare/kumo` 正式版本已经包含 `rangeSelectionBehavior` 与 `onRangeComplete` 后，删除整个 `kumo-date-picker/` 目录，并让 `src/components/ui/kumo.jsx` 的 `DatePicker` 回切上游包导出。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
