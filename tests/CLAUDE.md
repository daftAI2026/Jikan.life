# tests/
> L2 | 父级: /CLAUDE.md

成员清单
kumo-migration.ui.behavior.test.js: Kumo 迁移 UI/工作区护栏，约束 Button/Select/Popover/ColorPicker 链路、HomeSidebar/Workspace 结构与 Setup 流程语义。
kumo-migration.core.behavior.test.js: Kumo 迁移核心域护栏，约束 shared/worker/renderer/i18n 关键语义与 Goal 日期兼容链路。
goal-date-updater.unit.test.js: Goal 日期更新器语义单测，覆盖 range/start/date 更新与错误回填矩阵。
date-math.unit.test.js: shared/date-math 单测，覆盖闰年规则、年天数、年内序号与 day number 连续性。
helpers/source-test-helpers.js: 测试辅助工具，统一源码读取、目录扫描与 named import 断言。
worker-svg.behavior.test.js: Worker SVG 字体属性护栏，防止 `font-family` 发生双引号拼接错误导致 XML 解析失败。
contrast-threshold.behavior.test.js: 颜色对比度护栏，约束 getContrastBase 感知阈值 0.179、resolveContrastBase 覆盖逻辑和 contrastAlpha 向后兼容。

架构决策
测试采用 `node --test` 原生执行，迁移护栏以“行为断言 + 必要源码契约”并行，避免被实现形状绑架。

开发规范
新增 UI 迁移类改动时，必须同步补充 `kumo-migration.ui.behavior.test.js` 或 `kumo-migration.core.behavior.test.js` 的关键断言。

变更日志
2026-03-01: 新增 `goal-date-updater.unit.test.js` 与 `date-math.unit.test.js`；`kumo-migration.core/ui` 将 Goal 更新与 Sidebar 拆分护栏从源码形状断言升级为行为语义断言。
2026-03-01: 删除 `date-picker.behavior.test.js`，其必要删除护栏并入迁移测试；`kumo-migration.behavior.test.js` 拆分为 `kumo-migration.ui.behavior.test.js` 与 `kumo-migration.core.behavior.test.js`，并抽出 `helpers/source-test-helpers.js` 复用工具函数。
2026-02-26: `kumo-migration.behavior.test.js` 新增 Skeleton Base + AutoFlow 护栏：锁定 `HomePage` 空态初始化（`selectedStyle=null`）、`useHomeWallpaperConfig` 空态类型、`HomeGrid` 的浏览器级 AutoFlow 存储键与 stage 管理、`HomePreviewPane`/`HomeSettingsPane` 的官方 `SkeletonLine` 分支，以及 `kumo.jsx` 对 `SkeletonLine` 的统一导出。
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
2026-02-22: 新增技术债 TODO：Worker 侧 `worker/svg.js` 仍使用本地 `FONT_FAMILY_BY_LANG`，尚未统一复用 `shared/wallpaper-core.js#getWallpaperFontFamily`；已通过 `test.todo(...)` 挂起跟踪（已于 2026-02-25 关闭）。
2026-02-25: 新增 `contrast-threshold.behavior.test.js`，锁定明度感知阈值 0.179、resolveContrastBase 覆盖逻辑和 contrastAlpha 向后兼容行为（8/8 通过）。
2026-02-25: `kumo-migration.behavior.test.js` 的 SetupGuidePanel 断言更新为 Kumo `Surface` 版本：强制检查 `SetupGuidePanel` 从 `@/components/ui/kumo` 引入 `Surface`，防止步骤卡外框回退到原生标签。
2026-02-25: `kumo-migration.behavior.test.js` 新增 Setup 列表 bullet 色作用域护栏：要求 `.step-list-ul li::before` 使用 `var(--step-list-bullet-color, var(--color-kumo-brand))`，并校验 `[data-home-settings-setup-panel]` 覆盖为 `var(--text-color-kumo-default)`。
2026-02-25: `kumo-migration.behavior.test.js` 新增步骤描述文本常量化护栏：锁定 `STEP_DESC_TEXT_CLASSNAME` 及其引用，防止 class 字符串重复回流。
2026-02-25: `kumo-migration.behavior.test.js` 将 Worker 字体技术债从 `test.todo(...)` 升级为正式断言：强制 `worker/svg.js` 复用 `getWallpaperFontFamily`，并禁止回流本地 `FONT_FAMILY_BY_LANG`。
2026-02-25: `worker-svg.behavior.test.js` 增加英/中文字体族 XML 属性护栏：要求 `font-family` 输出保持引号安全转义（`&quot;...&quot;`），防止共享字体串接入后出现属性构造错误。
2026-02-25: `kumo-migration.behavior.test.js` 新增 Goal 日期收敛护栏：要求 `useHomeWallpaperConfig` 存在统一入口 `applyGoalDateUpdate`，并强制 `setGoalRange/setGoalStart/setGoalDate` 仅做参数适配委托；同时锁定 start/date 非法输入与跨字段阻断时的历史错误写回语义。
2026-02-18: 新增 `worker-svg.behavior.test.js`，锁定 `createSVG` 的 `font-family` 属性合法性，防止 `format=svg` 回归为 attributes construct error。
2026-02-12: `kumo-migration.behavior.test.js` 增加 ColorPicker 状态桥接与禁用实验性 pointer-bridge 的护栏断言，防止底边跳左问题回归。
2026-02-12: `kumo-migration.behavior.test.js` 追加“状态桥 hook 外提后路径与同步保护语义”断言，防止 hook 回流到组件内并导致职责回退。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
