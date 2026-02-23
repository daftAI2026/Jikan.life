# tests/
> L2 | 父级: /CLAUDE.md

成员清单
date-picker.behavior.test.js: DatePicker 交互与结构护栏，防止输入/弹层回归。
kumo-migration.behavior.test.js: Kumo 迁移行为护栏，约束 Button/Select/Popover/ColorPicker 等关键链路，并覆盖 HomeSidebar Year 10x10 点阵映射与跨午夜刷新语义。
worker-svg.behavior.test.js: Worker SVG 字体属性护栏，防止 `font-family` 发生双引号拼接错误导致 XML 解析失败。

架构决策
测试采用 `node --test` 原生执行，优先用源码断言守住组件契约，避免 UI 迁移时无声回退。

开发规范
新增 UI 迁移类改动时，必须同步补充 `kumo-migration.behavior.test.js` 的关键断言。

变更日志
2026-02-23: `kumo-migration.behavior.test.js` 新增 HomeSidebar Year 预览护栏：强制 `YEAR_GRID_COLUMNS=10`、`scale-[1]`、百分比同源映射与 `0%` 仍保留 today 点；新增 `todayKey + useEffect` 跨午夜刷新断言，禁止 `useMemo(..., [])` 固化旧日数据。
2026-02-22: `kumo-migration.behavior.test.js` 重写过期断言：`KumoMenuIcon` 路径/符号更新为 `JikanMenuIcon`，Sidebar 受控断言更新为 `data-sidebar-open={isSidebarOpen}`，与当前实现一致。
2026-02-22: 新增技术债 TODO：Worker 侧 `worker/svg.js` 仍使用本地 `FONT_FAMILY_BY_LANG`，尚未统一复用 `shared/wallpaper-core.js#getWallpaperFontFamily`；已通过 `test.todo(...)` 挂起跟踪，后续单独修复。
2026-02-18: 新增 `worker-svg.behavior.test.js`，锁定 `createSVG` 的 `font-family` 属性合法性，防止 `format=svg` 回归为 attributes construct error。
2026-02-12: `kumo-migration.behavior.test.js` 增加 ColorPicker 状态桥接与禁用实验性 pointer-bridge 的护栏断言，防止底边跳左问题回归。
2026-02-12: `kumo-migration.behavior.test.js` 追加“状态桥 hook 外提后路径与同步保护语义”断言，防止 hook 回流到组件内并导致职责回退。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
