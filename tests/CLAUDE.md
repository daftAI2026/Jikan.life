# tests/
> L2 | 父级: /CLAUDE.md

成员清单
home-sidebar-cards.unit.test.js: HomeSidebarCards 单测，锁定隐藏卡过滤、移动端 active style 回退与英文 Year/Goal 统计单行语义。
seo-homepage.behavior.test.js: 首页 SEO 护栏，锁定 index.html 的最小离屏语义、`WebSite/WebApplication` JSON-LD、非阻塞字体加载、单 URL sitemap 与真相源一致性。
registry-effective-layout.unit.test.js: 抽屉开关驱动的布局 helper 单测，锁定真实 tier 与桌面壳启用矩阵（含 `md + 抽屉关闭 => desktop shell`）。
lock-screen-overlay-runtime.unit.test.js: 锁屏 overlay runtime helper 单测，锁定 `wallpaperLang` 驱动的多语言真实日期格式、24 小时制时间格式、Apple 判定、字体分流与分钟/午夜刷新计时。
lock-screen-overlay-colors.unit.test.js: 锁屏 overlay 配色/材质映射单测，锁定主时钟/日期/widgets 前景跟随 accent、widgets 背景为 accent 的 15% alpha，并锁定 top 整条状态栏与 home indicator 只按 bgColor 明暗切 `kumo default/inverse` token，同时为 `swipe-indicator` 与底部 action glass 校验深/浅/彩色背景样本。
kumo-migration.ui.foundation.behavior.test.js: Kumo UI 基础层护栏，锁定依赖、版本同步链路、全局入口、基础 UI 封装、ColorPicker 语义与通用禁用项。
kumo-migration.ui.registry-shell.behavior.test.js: Registry 壳层护栏，锁定 HomePage 布局、Topbar/MobileFooter、LanguageSelect、Sidebar 与壳层导入边界。
kumo-migration.ui.bottom-tabs.behavior.test.js: Kumo md bottom-tabs 护栏，锁定 HomeSettingsPane 视图拆分、tabs 测量链、指标条过渡与底栏 skeleton 语义。
kumo-migration.ui.behavior.test.js: Kumo Workspace/Settings 护栏，约束 workspace 配置、设备与日期卡片、SetupGuidePanel、HomeGrid、Year/Goal inline SVG 预览与通用 skeleton 语义。
md-bottom-tabs-widths.unit.test.js: md 底部 tabs 宽度分配算法单测，锁定“余量均分 + 最长项先压到次长项 + 压平后再联动收缩”语义。
mobile-preview-sizing.unit.test.js: segmented 预览尺寸单测，锁定 iPhone SE / 12 / 14 Pro Max 的首屏预算，以及 `mobile + md segmented` 共享同一 `targetHeight` 最大尺度的语义。
kumo-migration.core.behavior.test.js: Kumo 迁移核心域护栏，约束 shared/worker/inline SVG preview/i18n 关键语义与 Goal 日期兼容链路。
goal-date-updater.unit.test.js: Goal 日期更新器语义单测，覆盖 range/start/date 更新与错误回填矩阵。
date-math.unit.test.js: shared/date-math 单测，覆盖闰年规则、年天数、年内序号与 day number 连续性。
helpers/: 测试辅助模块，提供源码读取、目录扫描、named import 断言等复用能力（详见 helpers/CLAUDE.md）。
worker-svg.behavior.test.js: Worker SVG 字体属性护栏，防止 `font-family` 发生双引号拼接错误导致 XML 解析失败。
worker-routing.behavior.test.js: Worker 路由与部署契约护栏，锁定 `/` `/app` `/app/` 先走 Worker、内部 `CLAUDE.md` / `component-registry` 不得公网直出，并约束首页 HTML 只剥离 `<!doctype>` 之前的前导构建注释。
og-image.behavior.test.js: OG 分享卡护栏，锁定 `/og-image.png` 的动态渲染入口、`?yes=1` 语义、参考图构图与白底 25x5 点阵布局。
contrast-threshold.behavior.test.js: 颜色对比度护栏，约束共享核心按 WCAG contrast ratio 选择黑/白前景，并保留 resolveContrastBase/contrastAlpha 覆盖兼容。
accent-mode.behavior.test.js: 颜色配置状态护栏，锁定 accent auto/manual 模式、背景联动边界与 preset 恢复自动语义。
random-preset.behavior.test.js: 随机 preset 行为护栏，锁定 `preset-8` 的随机语义、workspace 候选色状态与 colors 卡的黑色 Shuffle 入口。
wallpaper-core-api.behavior.test.js: wallpaper-core Facade API 护栏，锁定导出集合与关键常量/文案/日期校验语义。
wallpaper-visual-snapshots.behavior.test.js: 壁纸 SVG 视觉快照护栏，固定 Date 后校验 Year/Life/Goal 输出哈希不漂移。

架构决策
测试采用 `node --test` 原生执行，迁移护栏以“行为断言 + 必要源码契约”并行，避免被实现形状绑架。

开发规范
新增 UI 迁移类改动时，必须按职责同步补充 `kumo-migration.ui.foundation.behavior.test.js` / `kumo-migration.ui.registry-shell.behavior.test.js` / `kumo-migration.ui.behavior.test.js` 或 `kumo-migration.core.behavior.test.js` 的关键断言。

变更日志
2026-03-28: 更新 `kumo-migration.ui.behavior.test.js` 与 `kumo-migration.core.behavior.test.js`，新增 Accent 字段级 tooltip 护栏：要求 `CardField` 支持通用字段 tooltip、`colors-card.jsx` 将 `config.accentTooltip` 接到 Accent 标签右侧 info 图标，并锁定 `i18n.js` 四语词条齐全。
2026-03-27: 新增 `random-preset.behavior.test.js`，锁定 `shared/palettes.js` 的 `preset-8 kind="random"` 元数据、`useHomeWallpaperConfig` 的随机候选色状态与 `applyRandomPalette()` 接线、`colors-card.jsx` 的黑色 `Shuffle` 入口，以及 `config.randomPreset` 四语无障碍文案。
2026-03-26: 新增 `seo-homepage.behavior.test.js`，锁定首页 `index.html` 的 `canonical`、`WebSite/WebApplication` 两段 JSON-LD、`#root` 内最小离屏 SEO 语义、字体 preload + noscript fallback、`public/sitemap.xml` 单 URL 策略，以及设备支持/语言能力与真相源一致；`kumo-migration.ui.registry-shell.behavior.test.js` 同步新增 `HomeSidebar` 不再输出 `h1` 与 `HomePage` 运行时离屏 H1 的语义护栏。
2026-03-26: 新增 `og-image.behavior.test.js`，锁定 OG 分享卡的动态 `/og-image.png?yes=1` 入口、`1200x630` 分享尺寸、参考图式左上 wordmark / 右上 favicon / 25x5 点阵构图，以及白底黑字的极简视觉语义。
2026-03-21: 修正 `kumo-migration.ui.behavior.test.js` 的 YearPreviewSvg 源码断言，完成态 dot 的 `fillOpacity` 现在只作用于 `!today && completed`，与 `src/pages/registry/sections/workspace/YearPreviewSvg.jsx` 的现实现一致，避免把 today 高亮误判为回退。
2026-03-21: 更新 `kumo-migration.ui.behavior.test.js` / `kumo-migration.core.behavior.test.js`：前端 live preview 从 Canvas 一次性迁移到 inline SVG，新增 `YearPreviewSvg.jsx` / `GoalPreviewSvg.jsx` 源码护栏与 365 dots、dashoffset、字体链路断言，`src/lib/renderer.js` 同步退场。
2026-03-26: 更新 `worker-routing.behavior.test.js`，锁定 `wrangler.toml` 必须将 `/` `/app` `/app/` 放入 `run_worker_first`，确保首页 HTML 先经 Worker 再回源静态资源，从而让 `og:image` 能按当前 origin 动态改写；同时保留废弃入口 `/app` `/app/` 的边缘层 `308 -> /` 约束。
2026-04-03: 更新 `worker-routing.behavior.test.js`，新增内部资源边界护栏：要求 `worker/index.js` 在 `env.ASSETS.fetch` 之前拦截 `*/CLAUDE.md` 与 `/api/component-registry`，并锁定首页 HTML 注释清理只能剥离 `<!doctype>` 之前的前导构建注释，禁止回退为全局删除所有 `<!-- -->`。
2026-03-21: 更新 `home-sidebar-cards.unit.test.js` 与 `kumo-migration.ui.registry-shell.behavior.test.js`，新增 Year/Goal 卡统计文案与布局护栏：英文 Year 收口为两列单行 `Day 80` / `22% Complete`，英文 Goal 收口为两列单行 `Target` / `Daily tracking`；两者都通过“不可见双行占位 + 绝对定位居中层”保持原双行 stat 的两横线间距与垂直居中，并强制两列模式移除中间竖线、左列左对齐、右列整体右对齐；非英文继续保持默认双行语义。
2026-03-16: 新增 `home-sidebar-cards.unit.test.js`，锁定移动端 style sidebar 的隐藏卡过滤与 active style fallback；同步更新 `kumo-migration.ui.registry-shell.behavior.test.js`，要求 `HomeSidebar` 使用底部 segmented tabs 单卡布局并通过纯 helper 收口可见卡语义。
2026-03-12: 更新 `kumo-migration.core.behavior.test.js` / `wallpaper-visual-snapshots.behavior.test.js`：Goal 圆环护栏从“剩余比例递减环”翻为“完成比例顺时针增长环”，并新增 `goal-ring-geometry.js` 正式接线断言，防止再次出现“写了真相源但未消费”的孤儿模块。
2026-03-14: 新增 `mobile-preview-sizing.unit.test.js` 并更新 `kumo-migration.ui.behavior.test.js`：将锁屏预览从固定 `targetHeight=510` 升级为 `mobile-preview-sizing.js` 单一真相源，要求 HomeGrid 按 mobile workspace 高度下发 `previewTargetHeight`，同时锁定 HomePreviewPane/LockScreenPreviewFrame 的可变 target height 接线与首屏预算语义。
2026-03-14: 更新 `mobile-preview-sizing.unit.test.js` 与 `kumo-migration.ui.behavior.test.js`：segmented 预览最大尺度不再分裂为 `mobile 380 / md 510` 两套标准，改为锁定 `mobile + md drawer open` 共用 `510` 上限，仅在短窗时按首卡预算收缩。
2026-03-12: 更新 `kumo-migration.ui.behavior.test.js`：将首次引导锁屏 overlay 收尾阶段纳入护栏，要求 `HomeGrid.jsx` 新增独立 `isPreviewChromeRevealed` 状态与 ref 化调度清理、卡片全解锁后额外停顿 `150ms` 再通过下一帧 `requestAnimationFrame` reveal preview chrome，并要求 `HomePreviewPane.jsx` 改为显式消费父级 `showOverlay`。
2026-03-12: 更新 `kumo-migration.ui.behavior.test.js`：要求 `LockScreenPreviewFrame.jsx` 为整套锁屏 overlay 增加独立淡入 wrapper（`data-preview-overlay="lock-screen"` + `animate-in fade-in duration-150`），防止动画回流到 `LockScreenOverlay.jsx` 内部层树。
2026-03-12: 更新 `lock-screen-overlay-runtime.unit.test.js` 与 `kumo-migration.ui.behavior.test.js`：锁定 `HomePreviewPane -> LockScreenPreviewFrame -> LockScreenOverlay` 的 `wallpaperLang` 透传链，要求仅 `date-text` 按 `en / zh-CN / zh-TW / ja` 输出手工拼接格式并复用 `getWallpaperFontFamily`；其余 overlay 文本继续保持既有英文字体策略。
2026-03-12: 更新 `kumo-migration.ui.behavior.test.js`：将 glass DOM 专属 offset 护栏从 `-3/-3` 收回到 `0/0`，继续要求 offset 只作用于 glass 原始像素坐标，不回流到底盘或 icon。
2026-03-12: 更新 `kumo-migration.ui.behavior.test.js`：将 glass DOM 专属 offset 护栏从 `-1/-1` 调整到 `-3/-3`，继续要求偏移只作用于 glass 原始像素坐标，不回流到底盘或 icon。
2026-03-12: 更新 `kumo-migration.ui.behavior.test.js`：在统一 `402x874` glass 平面的前提下，重新允许 `LockScreenOverlay.jsx` 为 DOM glass 层声明 `ACTION_GLASS_OFFSET_X/Y = -1`，并锁定偏移只作用于 glass 的原始像素坐标，不回流到底盘或 icon。
2026-03-12: 更新 `kumo-migration.ui.behavior.test.js`：要求 `LockScreenPreviewFrame -> LockScreenOverlay` 透传 `overlayScale={LOCK_SCREEN_LAYOUT.scale}`，并锁定 `LockScreenOverlay.jsx` 删除百分比 `resolveActionGlassFrameStyle()`、新增 `402x874` glass 平面与 `transform: scale(overlayScale)`，同时禁止任何 glass offset 常量或 `calc(...)` 定位补偿。
2026-03-11: 新增 `accent-mode.behavior.test.js`，锁定 workspace 颜色状态的 `accentMode(auto|manual)` 边界；更新 `contrast-threshold.behavior.test.js` 与 `wallpaper-core-api.behavior.test.js`，将共享自动前景决策护栏收敛到 WCAG contrast ratio，并新增 `getContrastRatio` facade 导出检查。
2026-03-11: 更新 `lock-screen-overlay-colors.unit.test.js`：将底部 action glass 材质透明度护栏改为 `dark=0.02 / colored=0.06 / light=0.09`，继续只锁背景透明度，不改边框、高光和 inset 阴影语义。
2026-03-11: 更新 `kumo-migration.ui.behavior.test.js`：将锁屏底部 action 阴影底盘护栏收回“保留原始底盘语义”，要求 `lock-screen-overlay.constants.js` 继续使用 `rgba(255,255,255,0.07)`，并锁定 `LockScreenOverlay.jsx` 的 `shadow svg` 层复用旧 `lock-screen-controls.svg` 的滤镜链、`mix-blend-mode: screen` 与单一过滤矩形结构，禁止再叠额外白色假底盘。
2026-03-11: 更新 `lock-screen-overlay-colors.unit.test.js` 与 `kumo-migration.ui.behavior.test.js`：为底部快捷按钮新增 action glass 护栏，要求 `lock-screen-overlay.colors.js` 暴露 `createLockScreenActionGlassMaterial()`，并锁定 `LockScreenOverlay.jsx` 采用 `shadow svg + glass dom + chrome svg` 混合结构、DOM glass 层包含 `backdrop-filter` / `-webkit-backdrop-filter`，同时 `HomePreviewPane -> LockScreenPreviewFrame -> LockScreenOverlay` 必须透传 `bgColor`。
2026-03-11: 更新 `lock-screen-overlay-colors.unit.test.js` 与 `kumo-migration.ui.behavior.test.js`：锁定 `action-left-icon` / `action-right-icon` 不再使用写死浅灰，而是和 `home-indicator` 共用 `bgColor -> 明暗判断 -> pure black/white token` 规则。
2026-03-11: 更新 `kumo-migration.ui.behavior.test.js`：锁屏 overlay 底部 controls 护栏改为 live Stack 语义，要求删除 `lock-screen-controls.svg` 黑盒引用、新增 `lock-screen-overlay.controls.js` 几何真相源、锁定 `Stack/Action 1/Action 2` 的 translate 与 Sketch 元数据常量，并同步要求 `public/preview/iPhone/lock-screen-controls.svg` 不再存在。
2026-03-11: 更新 `lock-screen-overlay-colors.unit.test.js` 与 `kumo-migration.ui.behavior.test.js`：为 `swipe-indicator` 新增 bgColor 驱动的真机近似拟合护栏，锁定 `#FFFFFF -> #CDD1CC`、`#000000 -> #404040`、`#86261F -> #C2605D`（小容差）三组样本，并要求 `createLockScreenTopOverlayColors()` 显式回填 `swipe-indicator`；顶部 status bar 与 `home-indicator` 现锁定为 `var(--color-black)` / `var(--color-white)` pure token 规则。
2026-03-11: 更新 `kumo-migration.ui.behavior.test.js`：要求锁屏 overlay 不再输出 `dynamic-island` 节点，且协议常量中不再保留对应 layer id/default color；同时保持顶部 status bar 其余节点护栏不变。
2026-03-11: 更新 `kumo-migration.ui.behavior.test.js`：为锁屏 overlay 第 3/4 个圆形组件补充 SVG 护栏，要求移除 `􀙖/􀆴` 字体 glyph，改为内联 `umbrella.fill` / `sun.horizon.fill` path，并禁止 `overlaySymbolFontFamily` 回流。
2026-03-11: 更新 `kumo-migration.ui.behavior.test.js`：为锁屏 overlay 第 1 个圆形组件补充 Sketch `iwatch` 护栏，要求移除 `72/52/89` 数字布局、保留 `widgets-complication-1-bg/fg` 颜色入口，并锁定中心 `applewatch` monochrome path。
2026-03-11: 新增 `lock-screen-overlay-colors.unit.test.js` 并更新 `kumo-migration.ui.behavior.test.js`：为锁屏 overlay 的配色映射补充护栏，强制 `HomePreviewPane` 把 `config.accentColor` 显式投影到主时钟/日期/widgets、把 `config.bgColor` 按现有背景明暗规则投影到整条 top 状态栏与 `home-indicator`；同时锁定 widgets `bg = accent 15% alpha`，禁止 top/home-indicator 回流到 accent 驱动。
2026-03-11: 更新 `lock-screen-overlay-runtime.unit.test.js` 与 `kumo-migration.ui.behavior.test.js`：为锁屏 overlay 的真实日期、真实 24 小时制时间、Apple/非 Apple 英文字体分流与分钟级自动刷新补充运行时/源码双护栏，禁止大时间回退为旧路径字形、禁止左上角回退为写死 `9:41`。
2026-03-10: 更新 `wallpaper-visual-snapshots.behavior.test.js` 与 `kumo-migration.ui.foundation.behavior.test.js`：将 Year/Life/Goal 视觉快照预期收敛到 `EXPECTED_HASHES` 常量，并同步 Year SVG 基线到 `YEAR_DOT_RADIUS_SCALE=0.8` 后的稳定输出；新增 `sync:wallpaper-snapshots` 脚本护栏，要求基线更新通过统一脚本回写，避免人肉复制 sha256 导致 CI 漂移。
2026-03-10: 更新 `kumo-migration.ui.registry-shell.behavior.test.js` 与 `kumo-migration.ui.behavior.test.js`：为 Goal range restart 桥接放行唯一合法路径 `src/components/ui/kumo.jsx -> vendor/kumo-date-picker`，并新增源码护栏要求 committed/draft 分层、`rangeSelectionBehavior="restart"`、`onRangeComplete` 与 `Popover` 受控开关共存，防止临时 vendor 扩散到页面层。
2026-03-10: 更新 `wallpaper-core-api.behavior.test.js`：新增 Year dot 尺寸常量护栏，锁定 facade 暴露与当前共享常量语义，防止圆点微调时 preview/Worker 共享比例漂移。
2026-03-11: 更新 `kumo-migration.ui.behavior.test.js`：锁屏 preview 命名链去历史化，要求 `LockScreenPreviewFrame` / `lock-screen-overlay` 统一改用 `LOCK_SCREEN_LAYOUT`、`LockScreenOverlay`、`LOCK_SCREEN_OVERLAY_*`，并要求静态壳资源位于 `public/preview/iPhone/lock-screen-*.svg`。
2026-03-10: 更新 `kumo-migration.ui.behavior.test.js`：新增 Figma 锁屏 preview 护栏，强制 `HomePreviewPane` 委托 `LockScreenPreviewFrame`、锁定 `450x920 / 402x874 / inset 24,23 / targetHeight 510` 布局真相源，并要求 `public/preview/iPhone/*` 静态壳资源存在。
2026-03-10: 更新 `kumo-migration.ui.behavior.test.js`：要求 `HomePreviewPane` 使用单一 `previewScale` 做严格等比缩放，禁止回流 `scaleX/scaleY` 分离缩放。
2026-03-10: 新增 `kumo-migration.ui.bottom-tabs.behavior.test.js`，继续从 `kumo-migration.ui.behavior.test.js` 抽离 md bottom-tabs 视图拆分、测量链与 skeleton 护栏，使 Workspace 主文件回到 800 行以下，降低导航壳与复杂底栏回归的耦合噪音。
2026-03-10: 新增 `kumo-migration.ui.foundation.behavior.test.js` 与 `kumo-migration.ui.registry-shell.behavior.test.js`，并收缩 `kumo-migration.ui.behavior.test.js` 为 Workspace/Settings 复杂交互护栏；拆分基础层、页面壳层与 workspace 层职责，避免 1500+ 行单文件回归时定位噪音。
2026-03-10: 更新 `wallpaper-core-api.behavior.test.js` / `kumo-migration.core.behavior.test.js` / `worker-svg.behavior.test.js` / `wallpaper-visual-snapshots.behavior.test.js`：新增 `goalName` 多语言字体策略护栏，要求 `Wallpaper Language` 仅控制固定文案语言，而 `goalName` 可在 `lang=en` 下独立触发中文/日文字体解析；同时锁定 Worker 字体 buffer 按 `goalName` 脚本补载，Preview 与 Worker 共享同一字体决策，并更新 SVG 快照基线以接受显式多字体导入。
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
