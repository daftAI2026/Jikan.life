# tests/
> L2 | 父级: /CLAUDE.md

成员清单
registry-effective-layout.unit.test.js: 抽屉开关驱动的布局 helper 单测，锁定真实 tier 与桌面壳启用矩阵（含 `md + 抽屉关闭 => desktop shell`）。
kumo-migration.ui.behavior.test.js: Kumo 迁移 UI/工作区护栏，约束 Button/Select/Popover/ColorPicker 链路、HomeSidebar/Workspace 结构、外层桌面壳、md drawer-open bottom-tabs 常驻 skeleton 语义、bottom-tabs 单文件视图提取、私有 hook 测量链下沉、tablist-only 观察、字体补测、deadzone 与 indicator live-resize 策略。
md-bottom-tabs-widths.unit.test.js: md 底部 tabs 宽度分配算法单测，锁定“余量均分 + 最长项先压到次长项 + 压平后再联动收缩”语义。
kumo-migration.core.behavior.test.js: Kumo 迁移核心域护栏，约束 shared/worker/renderer/i18n 关键语义与 Goal 日期兼容链路。
goal-date-updater.unit.test.js: Goal 日期更新器语义单测，覆盖 range/start/date 更新与错误回填矩阵。
date-math.unit.test.js: shared/date-math 单测，覆盖闰年规则、年天数、年内序号与 day number 连续性。
helpers/: 测试辅助模块，提供源码读取、目录扫描、named import 断言等复用能力（详见 helpers/CLAUDE.md）。
worker-svg.behavior.test.js: Worker SVG 字体属性护栏，防止 `font-family` 发生双引号拼接错误导致 XML 解析失败。
contrast-threshold.behavior.test.js: 颜色对比度护栏，约束 getContrastBase 感知阈值 0.179、resolveContrastBase 覆盖逻辑和 contrastAlpha 向后兼容。
wallpaper-core-api.behavior.test.js: wallpaper-core Facade API 护栏，锁定导出集合与关键常量/文案/日期校验语义。
wallpaper-visual-snapshots.behavior.test.js: 壁纸 SVG 视觉快照护栏，固定 Date 后校验 Year/Life/Goal 输出哈希不漂移。

架构决策
测试采用 `node --test` 原生执行，迁移护栏以“行为断言 + 必要源码契约”并行，避免被实现形状绑架。

开发规范
新增 UI 迁移类改动时，必须同步补充 `kumo-migration.ui.behavior.test.js` 或 `kumo-migration.core.behavior.test.js` 的关键断言。

变更日志
2026-03-10: 更新 `date-math.unit.test.js` / `wallpaper-core-api.behavior.test.js` / `kumo-migration.core.behavior.test.js` / `wallpaper-visual-snapshots.behavior.test.js`：新增 shared 时区日期真相源护栏，强制 Preview 改走 `timezone` 而非浏览器本地日历；新增 Goal URL 中文名标准 UTF-8 编码护栏，禁止 `encodeURIComponent + URLSearchParams` 双编码回流；同时锁定 Worker `goal` 环线宽/数字 Y 偏移向前端 Preview 对齐，并要求 `life` 当前周圆点半径不再额外放大。
2026-03-09: 更新 `kumo-migration.ui.behavior.test.js`：新增 `HomeSettingsPaneBottomTabsLayout.jsx` 视图提取护栏，强制 `HomeSettingsPane.jsx` 只保留编排层职责、`MD_BOTTOM_TABS_SLOT_COUNT` 继续留在 pane 侧，而 bottom-tabs 视图 helper/常量与 `useMdBottomTabsMetrics` 消费点下沉到独立私有文件，且新文件不反向依赖 pane 槽位常量。
2026-03-09: 更新 `kumo-migration.ui.behavior.test.js`：新增 `use-md-bottom-tabs-metrics.js` 私有 hook 护栏，强制 `HomeSettingsPane` 不再直接持有 tabs 测量/resize 状态，并锁定 hook 的输入签名、首帧同步测量、`document.fonts.ready` 补测、tablist-only ResizeObserver、`>1px` deadzone、宽度未就绪时隐藏 indicator、live resize 时关闭 indicator 过渡，以及 6 槽 CSS var/trigger class 常量收口语义。
2026-03-05: 更新 `kumo-migration.ui.behavior.test.js`：新增提交流程与 CI 一致性护栏，强制 `hooks:install/postinstall`、`scripts/git-hooks/pre-commit` 自动同步链路，以及 CI 必跑 `check:version-metadata`。
2026-03-09: 新增 `md-bottom-tabs-widths.unit.test.js`，锁定 md 底部 tabs 的“自然宽测量后余量均分 / 最长项先压到次长项 / 压平后再联动收缩”分配算法；并更新 `kumo-migration.ui.behavior.test.js`，要求 `HomeSettingsPane` 通过隐藏测量节点 + `resolveMdBottomTabWidths` + trigger 级 CSS 变量宽度控制实现底栏分配，不再回退到 label 假宽度或恒等宽 `flex-1`；同时锁定 `md + drawer open + selectedType === null` 时改走全量 tabs + 单卡 skeleton，而不是 6 格 grid reveal，并要求 tabs/title 壳层常驻、文案 skeleton 按 reveal 解开而非重挂载底栏；另要求第⑥卡在 `md` bottom-tabs 下复用 `mid` 的 anchored row 收口布局，不再把同一抗挤压语义绑死在 tier 名字上；同时新增首帧同步测量、natural widths 缓存、仅观察 tablist 宽和 resize 期间关闭 indicator 过渡的护栏，防止小胶囊宽度错乱与拖窗追赶动画回流。
2026-03-05: 更新 `kumo-migration.ui.behavior.test.js`：将版本同步护栏收敛为统一入口，强制存在 `sync/check:version-metadata` 并要求 `npm version` 链路仅引用该聚合脚本，同时禁止旧分裂命令回流。
2026-03-07: 更新 `kumo-migration.ui.behavior.test.js`：`HomeGrid` 新增 `sidebarOpen` 输入护栏，并锁定真 `md` 下 SetupGuide 宿主左边界随 style 抽屉开关在 `rail` 与 `rail + sidebar panel width` 间切换，防止再次盖住 `Choose your style`。
2026-03-09: 更新 `registry-effective-layout.unit.test.js` 与 `kumo-migration.ui.behavior.test.js`：撤回 `settingsLayoutTier` 护栏，改为锁定 `HomeGrid` 在真 `md + 抽屉关闭` 时局部把右侧 pane 送进 mid 路径，并要求 `HomePage` 维持真实 tier，不再额外改 header/main-content 高度链。
2026-03-04: 新增 `registry-effective-layout.unit.test.js`，覆盖 `window.innerWidth + sidebarOpen` 的有效布局层级矩阵（1314 含边界）并验证 `1024~1314` 区间行为。
2026-03-04: 更新 `registry-effective-layout.unit.test.js` 与 `kumo-migration.ui.behavior.test.js`：`open + 1024~1314 => mid`，并新增 HomeSettingsPane 中间态单列等分行护栏（year=5；goal/life/空态=6）。
2026-03-04: 更新 `kumo-migration.ui.behavior.test.js`：新增 `mid + year/goal` URL 收口卡护栏（`effectiveLayoutTier` 透传、`grid-cols-[minmax(0,1fr)_auto]`、`gap-2`、输入框可缩/按钮不缩）并保留非 mid 的 `md:px-[calc(25%-100px)]` 与 goal 旧布局断言。
2026-03-04: 更新 `kumo-migration.ui.behavior.test.js`：新增 SetupGuidePanel 关闭态隔离护栏（`aria-modal` 打开态限定、`aria-hidden`、`inert`），并为 Set-it 链路增加 `event.currentTarget` 透传与 HomeGrid 关闭后回焦断言。
2026-03-04: 更新 `kumo-migration.ui.behavior.test.js`：SetupGuide 挂载策略改为单宿主互斥护栏（HomeGrid 仅 `effectiveLayoutTier==="md"` 挂载，HomeSettingsPane 仅非 md 挂载），并移除 `guideVisibilityClassName` 旧断言。
2026-03-04: 更新 `kumo-migration.ui.behavior.test.js`：Guide 宿主判定改为 HomeGrid 单一真相源护栏（`shouldRenderPaneGuideHost = !shouldRenderGridGuideHost` + 透传到 HomeSettingsPane）。
2026-03-01: 新增 `wallpaper-core-api.behavior.test.js`（冻结 facade 导出集合 23 项）与 `wallpaper-visual-snapshots.behavior.test.js`（固定 Date + Year/Life/Goal SVG sha256 护栏）；`kumo-migration.core.behavior.test.js` 将 goalDefault 校验从源码形状断言升级为运行时行为断言。
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
