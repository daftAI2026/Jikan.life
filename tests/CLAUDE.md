# tests/
> L2 | 父级: /CLAUDE.md

成员清单
date-picker.behavior.test.js: DatePicker 交互与结构护栏，防止输入/弹层回归。
kumo-migration.behavior.test.js: Kumo 迁移行为护栏，约束 Button/Select/Popover/ColorPicker 等关键链路，并覆盖 HomeSidebar Year 10x10 点阵映射与跨午夜刷新语义。
worker-svg.behavior.test.js: Worker SVG 字体属性护栏，防止 `font-family` 发生双引号拼接错误导致 XML 解析失败。
contrast-threshold.behavior.test.js: 颜色对比度护栏，约束 getContrastBase 感知阈值 0.179、resolveContrastBase 覆盖逻辑和 contrastAlpha 向后兼容。

架构决策
测试采用 `node --test` 原生执行，优先用源码断言守住组件契约，避免 UI 迁移时无声回退。

开发规范
新增 UI 迁移类改动时，必须同步补充 `kumo-migration.behavior.test.js` 的关键断言。

变更日志
2026-02-24: `kumo-migration.behavior.test.js` 增加 iOS 第3步 `ClipboardText` 尺寸护栏（`size="base"`），锁定其与 Setup URL 输入框同高，防止回退到 `lg` 导致视觉不齐。
2026-02-24: `kumo-migration.behavior.test.js` 新增 SetupGuidePanel 第3步护栏：要求 `HomeSettingsPane -> SetupGuidePanel` 透传 `url`，并断言 iOS 第3步使用 `ClipboardText` + `w-3/4` + `url.placeholder` 同源回退。
2026-02-24: `kumo-migration.behavior.test.js` 新增 i18n 断言，强制 `setup.ios.step3.*`（action/copy tooltip/accessible label）四语齐全，避免第3步改造后出现单语回退。
2026-02-24: `kumo-migration.behavior.test.js` 的设备可见性断言改为检查 `workspace/device-visibility.js` 的共享常量引用，防止 `device-card` 与 `useHomeWallpaperConfig` 各自定义策略造成漂移。
2026-02-24: `kumo-migration.behavior.test.js` 新增 `config.deviceTooltip` 四语完整性断言，避免 Device 提示文案只改单语导致回归。
2026-02-24: `kumo-migration.behavior.test.js` 的 device card 断言新增 `titleTooltipKey="config.deviceTooltip"`，防止 Device 信息提示图标与文案键回退。
2026-02-24: `kumo-migration.behavior.test.js` 的 device card 断言更新为 iPhone-only 可见策略（`VISIBLE_DEVICE_CATEGORIES=["iPhone"]`），并新增状态层 iPhone 可见性兜底断言，防止 Android/iPad 入口回流。
2026-02-23: `kumo-migration.behavior.test.js` 追加 iPhone 系列顺序与机型分辨率护栏：强制 17→16→15→14→13→12 排序，锁定 `iPhone 17=1206x2622`，并校验新增 `12 mini/16 Pro/16 Pro Max/17 Air`。
2026-02-23: `kumo-migration.behavior.test.js` 新增 iPhone 设备数据护栏：强制连写名称拆分为单机型项，并要求保留旧名称归一与 `setDevice` 归一调用，防止历史值失效。
2026-02-23: `kumo-migration.behavior.test.js` 新增 HomeSidebar Year 预览护栏：强制 `YEAR_GRID_COLUMNS=10`、`scale-[1]`、百分比同源映射与 `0%` 仍保留 today 点；新增 `todayKey + useEffect` 跨午夜刷新断言，禁止 `useMemo(..., [])` 固化旧日数据。
2026-02-22: `kumo-migration.behavior.test.js` 重写过期断言：`KumoMenuIcon` 路径/符号更新为 `JikanMenuIcon`，Sidebar 受控断言更新为 `data-sidebar-open={isSidebarOpen}`，与当前实现一致。
2026-02-22: 新增技术债 TODO：Worker 侧 `worker/svg.js` 仍使用本地 `FONT_FAMILY_BY_LANG`，尚未统一复用 `shared/wallpaper-core.js#getWallpaperFontFamily`；已通过 `test.todo(...)` 挂起跟踪，后续单独修复。
2026-02-25: 新增 `contrast-threshold.behavior.test.js`，锁定明度感知阈值 0.179、resolveContrastBase 覆盖逻辑和 contrastAlpha 向后兼容行为（8/8 通过）。
2026-02-25: `kumo-migration.behavior.test.js` 的 SetupGuidePanel 断言更新为 Kumo `Surface` 版本：强制检查 `SetupGuidePanel` 从 `@/components/ui/kumo` 引入 `Surface`，防止步骤卡外框回退到原生标签。
2026-02-25: `kumo-migration.behavior.test.js` 新增 Setup 列表 bullet 色作用域护栏：要求 `.step-list-ul li::before` 使用 `var(--step-list-bullet-color, var(--primary))`，并校验 `[data-home-settings-setup-panel]` 覆盖为 `var(--foreground)`。
2026-02-25: `kumo-migration.behavior.test.js` 新增步骤描述文本常量化护栏：锁定 `STEP_DESC_TEXT_CLASSNAME` 及其引用，防止 class 字符串重复回流。
2026-02-18: 新增 `worker-svg.behavior.test.js`，锁定 `createSVG` 的 `font-family` 属性合法性，防止 `format=svg` 回归为 attributes construct error。
2026-02-12: `kumo-migration.behavior.test.js` 增加 ColorPicker 状态桥接与禁用实验性 pointer-bridge 的护栏断言，防止底边跳左问题回归。
2026-02-12: `kumo-migration.behavior.test.js` 追加“状态桥 hook 外提后路径与同步保护语义”断言，防止 hook 回流到组件内并导致职责回退。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
