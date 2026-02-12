# tests/
> L2 | 父级: /CLAUDE.md

成员清单
date-picker.behavior.test.js: DatePicker 交互与结构护栏，防止输入/弹层回归。
kumo-migration.behavior.test.js: Kumo 迁移行为护栏，约束 Button/Select/Popover/ColorPicker 等关键链路。

架构决策
测试采用 `node --test` 原生执行，优先用源码断言守住组件契约，避免 UI 迁移时无声回退。

开发规范
新增 UI 迁移类改动时，必须同步补充 `kumo-migration.behavior.test.js` 的关键断言。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
