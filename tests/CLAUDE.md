# tests/
> L2 | 父级: /CLAUDE.md

成员清单
date-picker.behavior.test.js: DatePicker 交互与结构护栏，防止输入/弹层回归。
kumo-migration.behavior.test.js: Kumo 迁移行为护栏，约束 Button/Select/Popover/ColorPicker 等关键链路。

架构决策
测试采用 `node --test` 原生执行，优先用源码断言守住组件契约，避免 UI 迁移时无声回退。

开发规范
新增 UI 迁移类改动时，必须同步补充 `kumo-migration.behavior.test.js` 的关键断言。

变更日志
2026-02-12: `kumo-migration.behavior.test.js` 增加 ColorPicker 状态桥接与禁用实验性 pointer-bridge 的护栏断言，防止底边跳左问题回归。
2026-02-12: `kumo-migration.behavior.test.js` 追加“状态桥 hook 外提后路径与同步保护语义”断言，防止 hook 回流到组件内并导致职责回退。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
