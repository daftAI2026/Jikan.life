# workspace/
> L2 | 父级: /src/pages/registry/sections/CLAUDE.md

成员清单
useHomeWallpaperConfig.js: 工作区状态编排核心，管理 selectedStyle 联动、生命周期、设备可见性、随机预设候选色与 URL 桥接；动作层委托 `config-actions.js` 生成（UI 文案跟随全局 i18n）
config-actions.js: 配置动作工厂层，统一 `set*/apply*/copyUrl` 状态更新语义、Goal 日期动作委托与 accent auto/manual 模式切换
config-init.js: 配置初始化层，统一默认配置、类型映射与颜色归一（`resolveSelectedType/getInitialConfig/resolvePalette`），并维护 accent auto/manual 模式边界
goal-date-updater.js: Goal 日期状态层，导出 `applyGoalRangeUpdate/applyGoalStartUpdate/applyGoalDateUpdate` 三个语义入口并复用统一验证流水线
url-builder.js: URL 构建层，统一 year/life/goal 参数序列化与 Goal 日期校验
view-model-mappers.js: 视图模型映射层，统一国家/语言选项与调色板 presets 组装，并将随机 preset 候选色投影到按钮视图模型
device-visibility.js: 设备可见性策略单一真相源，统一导出可见分类集合与主分类常量，供渲染层与状态层共享。
mobile-preview-sizing.js: segmented 预览尺寸真相源，统一维护锁屏基准几何、默认 target height、首卡/底栏保底预算与共享 targetHeight 上限；`mobile + md segmented` 共用 `510` 最大尺度，只在短窗时按预算收缩。
HomePreviewPane.jsx: 左侧手机预览面板，固定挂载 Figma 锁屏壳；仅负责空态提示与 year/goal inline SVG 的分发，并将父级控制的 `showOverlay`、`wallpaperLang + showWidgets` 与 segmented 预算后的 `previewTargetHeight` 透传给锁屏 overlay，同时保留 workspace accentColor / bgColor 的壳层投影职责。
YearPreviewSvg.jsx: Year inline SVG 预览渲染器，消费 `computeYearLayout/getDatePartsInTimezone/getWallpaperFontFamily/contrastAlpha`，绘制 365 dots、双色 stats 与 `preserveAspectRatio="xMidYMid slice"` 的浏览器原生预览画布。
GoalPreviewSvg.jsx: Goal inline SVG 预览渲染器，消费 `computeGoalLayout/getDatePartsInTimezone/getWallpaperText/getWallpaperFontFamily/resolveTextFontFamily/contrastAlpha/getGoalRingGeometry`，绘制背景环、dashoffset 进度环与三段文字，保证 goalName 字体链与 Worker 同构。
LockScreenPreviewFrame.jsx: Figma 锁屏壳私有 frame，收口 `450x920 / 402x874 / inset 24,23` 基准并消费可变 `targetHeight`，overlay 改走 inline 组件，并额外透传 `bgColor + overlayScale + wallpaperLang + showWidgets` 给底部 action glass、锁屏日期本地化链路与 goal-only widget 隐藏策略；overlay 外层 wrapper 统一提供轻量淡入，bezel 继续走静态资源。
HomeSettingsPane.jsx: 右侧设置面板主容器；回归 pane 编排层，只负责卡片顺序、6 站位空态 Skeleton Base、`revealStage` 渐进解锁、segmented workspace（`mobile + md drawer open`）与 grid 布局分流、title/body skeleton 与 `useAnchoredSetupRow` 语义收口；Guide 宿主继续读取 `shouldRenderPaneGuideHost`，导出 `SETTINGS_CARD_IDS`
HomeSettingsPaneBottomTabsLayout.jsx: md bottom-tabs 私有完整视图组件；承载 active card 壳、tab rail、隐藏测量节点、tab label skeleton 与视图专属 helper/常量，不再与 pane 编排层混写；active card 回归 `min-h-[220px]` 基线，不再吃满剩余高度
use-md-bottom-tabs-metrics.js: md bottom-tabs 私有测量 hook；输入 `tabsContainerRef/measureTriggerRefs/measureLabels`，统一首帧同步自然宽测量、`document.fonts.ready` 补测、tablist-only ResizeObserver、1px deadzone 与 live-resize indicator 显隐/禁过渡策略，输出 `distributedTabWidths/indicatorClassName`
md-bottom-tabs-widths.js: md 底部 Tabs 宽度算法层；输入自然宽与容器宽，输出“余量均分 / 最长项先压到次长项 / 压平后再联动收缩”的目标宽数组，供 `HomeSettingsPane` 单向投影到 trigger 本体。
SettingsCardShell.jsx: 右侧卡片统一壳组件，复刻 Kumo HomeGrid 单卡结构（可选左上标题 + 可选问号提示 + 右上序号 ➊~➏ + 中央内容）并提供 `data-home-settings-card` 业务选择器；支持 `className` 承接 type 专属跨列布局，并通过 `compactAtDesktop` 控制是否启用 `lg:min-h-0`
SetupGuidePanel.jsx: Goal 第⑥卡后的局部覆盖式设置引导层（右侧滑入），按设备类别自动分流 iOS/Android 步骤并承载关闭交互；支持 `containerClassName/asideClassName/visibilityClassName` 宿主样式注入以复用到 HomeGrid 的 md 整区覆盖场景；iOS 第3步使用 ClipboardText 展示与 URL 卡同源的长链接；步骤卡统一使用 Kumo LayerCard 组件与提取常量化 className，并收敛为“仅步骤区滚动”；关闭态通过 `inert + aria-hidden` 严格隔离可访问性与事件焦点。
cards/: Setting Panel 业务卡子模块目录，承载 location/wallpaper/goal/life/colors/device/url 卡片实现与聚合入口（详见 cards/CLAUDE.md）
lock-screen-overlay/: 锁屏 overlay 私有子模块目录，承载来自 jikan Sketch `iPhone locked` live 层级的 overlay；含 Widgets/Status/Stack 的几何与运行时协议（详见 lock-screen-overlay/CLAUDE.md）

结构
workspace/ - Home 双栏工作区子模块 (17 files + cards/ + lock-screen-overlay/ 子目录)

架构决策
采用“状态 hook + 左右面板”分层，HomeGrid 负责工作区编排并统一持有 Set-it 流程状态与 AutoFlow stage（浏览器级一次引导），同时把 segmented workspace（`mobile + md drawer open`）收敛为单一布尔真相源后透传给 pane。当前 AutoFlow 再拆为两条状态线：`revealStage` 只解锁右侧卡片 skeleton，左侧锁屏 preview chrome 改由独立布尔控制，并在首次引导最后一帧 reveal，避免把表现层耦进卡片计数器。segmented 首屏可操作性则额外收敛到 `mobile-preview-sizing.js`：HomeGrid 统一测量 workspace 高度并下发 `previewTargetHeight`，`HomePreviewPane.jsx` 只负责空态提示与 year/goal inline SVG 分发，Year/Goal 各自按导出坐标渲染后直接贴合 Wallpaper 槽位；`LockScreenPreviewFrame.jsx` 不再写死 `510px`，而是消费同一真相源输出的 target height，同时继续维持 `450x920 / 402x874 / inset 24,23` 的几何同构，消除旧通用手机壳的魔法数字并为 segmented 首卡保留生存空间。segmented workspace 的垂直分配现已回正为“preview 容器吃剩余、settings 保持基线”：外层壳改为 `grid-rows-[minmax(0,1fr)_auto]`，bottom-tabs active card 仅保留 `min-h-[220px]` 基线，不再通过 `h-full/flex-1` 回灌剩余高度；手机本体缩放则继续维持旧的视觉留白比例，但不再分裂成 `mobile 380 / md 510` 两套标准，而是统一为 `510` 最大尺度，仅在短窗下按首卡预算收缩。overlay 不再依赖整图静态 SVG，而是下沉到 `lock-screen-overlay/` 私有模块：以 `402x874` 坐标系承载 jikan Sketch `iPhone locked` 的 live 层树，其中底部 controls 进一步分层为 `shadow svg + glass dom + chrome svg`，保留 SVG 外阴影与 icon path，同时把圆盘实体抬到 DOM 层吃真实 `backdrop-filter`；Widgets/Date/Status 继续由私有几何模块托管，并用稳定 layer id 暴露颜色覆写；bezel 继续保留为静态资源。右侧设置区采用“card registry（业务语义）+ card order by type（位置编排）+ 壳组件”模式，把“卡片是谁”和“卡片放哪”彻底解耦；在 segmented workspace 下，pane 从多卡 grid 切为“上方单卡 + 底部 segmented tabs”，且空态不再回退 grid，而是直接显示六项全量 tabs（第 3 项固定占位 `Goal`）与单卡 skeleton。当前层次再收口为三段：`HomeSettingsPane.jsx` 负责编排与业务推导，`HomeSettingsPaneBottomTabsLayout.jsx` 负责 bottom-tabs 完整视图，`use-md-bottom-tabs-metrics.js` 负责测量链。tabs 壳层与单卡壳层常驻，`selectedType` 与 `revealStage` 只控制 title/tab label/body 的 skeleton 是否解开，不再控制底栏容器是否存在。底部宽度链已进一步收口到 `use-md-bottom-tabs-metrics.js`：首帧同步测 hidden trigger 自然宽，缓存 natural widths，字体未就绪时走 `document.fonts.ready` 补测，ResizeObserver 只观察 `[role="tablist"]` 并以 1px deadzone 过滤亚像素抖动；最终仍由 `md-bottom-tabs-widths.js` 负责分配算法，再通过容器 CSS 变量 + trigger 级 className 直接控制 Kumo trigger 本体，而不是回写到 label wrapper。`➊~➏` 固定为槽位 UX 编号，不承载业务语义。当前 `year` 启用 5 卡顺序并将槽位⑤扩为收口宽卡；`goal` 启用独立 6 卡顺序（槽位③为 `goal-fields`，槽位⑥为 `url` 收口）；`life` 启用独立 6 卡顺序（槽位③为 `life-fields`，槽位⑥为 `url` 收口）。

变更日志
2026-03-27: Colors preset 第 8 项升级为随机入口：`useHomeWallpaperConfig` 新增 `randomPaletteCandidate` 启动期状态与 `actions.applyRandomPalette()`，页面首开先准备候选随机色，点击时再生成并立即应用到当前壁纸；`view-model-mappers.js` 同步将 `preset.kind="random"` 投影为候选 `bg/accent`，避免随机逻辑泄漏到卡片外；当前按钮视觉收口为黑色 token 的 `Shuffle` icon。
2026-03-21: `HomePreviewPane` 将 `year/goal` live preview 从 Canvas 迁移到 inline SVG；新增 `YearPreviewSvg.jsx` / `GoalPreviewSvg.jsx` 私有组件，删除 `src/lib/renderer.js`，并把 preview 只保留为壳层尺寸 + overlay 透传。
2026-03-14: segmented preview 最大尺度再收口：`mobile + md drawer open` 不再分裂为 `380 / 510` 两套标准，统一共享默认 `510` 最大 target height，仅在短窗下按 `220 + 48 + 60` 首卡预算收缩，保证上下留白标准与 md 对齐。
2026-03-14: 新增 `mobile-preview-sizing.js` 作为移动端预览尺寸真相源；HomeGrid 现按 mobile workspace 实测高度下发 `previewTargetHeight`，HomePreviewPane/LockScreenPreviewFrame 消费可变 target height，在保持完整锁屏壳的前提下为 iPhone SE 首屏让出第一张设置卡空间。引入基于 `LOCK_SCREEN_LAYOUT` 的确定性投影数学模型，彻底消除模糊的近似 clamp 逻辑。

开发规范
只使用 Kumo token 与 `@/components/ui/*` 组件语义；任何配置字段新增必须同步更新 hook 输出和右侧表单映射，并同步 URL 参数链路。颜色相关自动前景决策统一复用 shared WCAG 核心，局部特例必须显式命名。

变更日志
2026-03-12: Goal Countdown 左侧锁屏预览新增 type-aware widget 可见性：`HomePreviewPane.jsx` 派生 `showWidgets = config.selectedType !== "goal"` 并沿 `LockScreenPreviewFrame -> LockScreenOverlay` 透传；仅 `goal` 预览隐藏四个 circular widgets，时间/日期/顶部状态栏/底部 controls 保持不变，生成链路与 URL 参数完全不受影响。
2026-03-12: 首次引导的左侧锁屏 overlay 改为独立收尾阶段：`HomeGrid.jsx` 新增 `isPreviewChromeRevealed` 与调度 ref，`revealStage` 继续只解锁右侧卡片；`HomePreviewPane.jsx` 则改为显式消费父级 `showOverlay`，使完整 preview chrome 可以在最后一张卡后额外停顿 `150ms` 再于下一帧单独出现，而回访与手动快进保持即时显示且不闪烁。
2026-03-12: `LockScreenPreviewFrame.jsx` 为整套 preview overlay 新增外层淡入 wrapper，统一使用轻量 `fade-in` 进入动画；动画只作用于壳层挂载，不下沉到 `LockScreenOverlay.jsx` 的 live SVG/DOM glass 内部结构。
2026-03-12: `HomePreviewPane -> LockScreenPreviewFrame -> LockScreenOverlay` 新增 `wallpaperLang` 透传链；锁屏 overlay 仅 `date-text` 按壁纸语言输出 `en / zh-CN / zh-TW / ja` 本地化格式并复用 shared 字体真相源，其他 overlay 文本维持原有英文字体策略。
2026-03-12: 锁屏底部 action glass 的 DOM 专属视觉补偿归零为 `0px/0px`；微调入口仍只存在于 `lock-screen-overlay/LockScreenOverlay.jsx` 的 glass 层，底盘与 icon 几何保持原始 Sketch frame。
2026-03-12: 锁屏底部 action glass 的 DOM 专属视觉补偿从 `-1px/-1px` 调整为 `-3px/-3px`；该偏移仍只作用于 `lock-screen-overlay/LockScreenOverlay.jsx` 的 glass 圆盘，底盘与 icon 几何保持原始 Sketch frame。
2026-03-12: 锁屏底部 action glass 在坐标系统一后恢复仅作用于 DOM glass 的 `-1px/-1px` 视觉补偿：`lock-screen-overlay/LockScreenOverlay.jsx` 通过 `ACTION_GLASS_OFFSET_X/Y` 单独微调 glass 圆盘，底盘和 icon 几何继续保持原始 Sketch frame。
2026-03-12: 锁屏底部 action glass 的坐标系统一为和 SVG 同构的 `402x874` 绝对平面：`LockScreenPreviewFrame.jsx` 现向 `lock-screen-overlay/LockScreenOverlay.jsx` 透传 `overlayScale={LOCK_SCREEN_LAYOUT.scale}`，glass DOM 不再走百分比定位，而是直接复用 `ACTION_LEFT/RIGHT_FRAME` 与 `STACK_FRAME.y` 的原始 viewBox 坐标，再通过统一 scale 缩放到预览容器；验收标准是重构后视觉不变。
2026-03-11: workspace 颜色状态新增 `accentMode(auto|manual)` 语义：默认自动联动背景，用户手动改 `accent` 后锁定为 manual，不再因背景变化被回改；点 palette preset 恢复 auto。共享前景黑白切换统一收敛到 shared WCAG 对比度核心。
2026-03-11: `HomePreviewPane.jsx` 现将 workspace `bgColor` 额外透传给 `LockScreenPreviewFrame.jsx`，供 `lock-screen-overlay/LockScreenOverlay.jsx` 生成底部快捷按钮的 action glass 材质；锁屏底部 controls 从纯 SVG 背景升级为 `shadow svg + glass dom + chrome svg` 混合结构，保留既有外阴影与 icon path，并让圆盘实体吃到 `backdrop-filter: blur(20px) saturate(180%)` 与高光边框。
2026-03-11: `lock-screen-overlay/LockScreenOverlay.jsx` 删除 `public/preview/iPhone/lock-screen-controls.svg` 黑盒引用，新增 `lock-screen-overlay.controls.js` 托管 Sketch `Page 1 / iPhone locked / Stack` 的 frame/master/override 元数据与左右 action path；锁屏底部 controls 正式回归 live `Stack -> Action -> bg/icon` 结构，位置尺寸继续锁死在 `0,766 / 46,0 / 298,0 / 58x58` 真相源。
2026-03-11: `HomePreviewPane.jsx` 新增并扩展 `lock-screen-overlay/lock-screen-overlay.colors.js` 配色映射链：workspace `accentColor` 显式投影到锁屏 overlay 的 `time-shape`、`date-text` 与四个 widgets，widgets 继续保持 `fg = accent / bg = accent 15% alpha` 关系；workspace `bgColor` 则复用现有背景明暗判断规则，映射到整条 top 状态栏（`status-bar-leading/status-bar-trailing/battery/wifi/cellular`）与 `home-indicator` 的 pure `black/white` palette token。`lock-screen-overlay/LockScreenOverlay.jsx` 仍保留主时钟真实 24 小时制、真实英文日期与字体分流逻辑。
2026-03-11: 锁屏 preview 命名链收平：overlay 组件与协议常量去掉 `dark` 历史前缀，静态资源同步迁移到 `public/preview/iPhone/lock-screen-*.svg`，整体语义从版本号目录回归到机型目录。
2026-03-11: `lock-screen-overlay/LockScreenOverlay.jsx` 改为“Stack 静态 controls + 其余层 inline”混合结构；`public/preview/iPhone/lock-screen-controls.svg` 升级为正式静态资源，运行时不再内联 Action 组几何。
2026-03-10: 新增 `LockScreenPreviewFrame.jsx` 与 `public/preview/iPhone/*` 静态 SVG，左侧 preview 固定切到 Figma `Lock Screen` 壳层；以 `Wallpaper 402x874` 为比例真相源并锁定目标高度 `510px`，`HomePreviewPane` 仅保留 live canvas / 空态提示内容。
2026-03-10: `HomePreviewPane` 的 preview 缩放矩阵收口为严格等比 `previewScale`，移除 `scaleX/scaleY` 分离缩放导致的几何轻微椭圆化；渲染路径仍保持“导出坐标先绘制，再映射到 preview”不变。
2026-03-10: `HomePreviewPane` 的 `year/life/goal` 预览统一改为“原始设备坐标绘制 + preview 缩放显示”，消除 `goal` 专属特判并让三类壁纸都与导出成品保持同一坐标语义。
2026-03-09: 新增 `HomeSettingsPaneBottomTabsLayout.jsx`，将 `HomeSettingsPane` 中的 bottom-tabs 完整视图链与视图专属 helper/常量整体提取到私有文件；`HomeSettingsPane.jsx` 进一步收敛为编排层，保留 `MD_BOTTOM_TABS_SLOT_COUNT` 作为 pane 侧布局常量，新视图文件不反向依赖该常量。
2026-03-09: 新增 `use-md-bottom-tabs-metrics.js`，把 `HomeSettingsPane` 的 md bottom-tabs 测量链整体下沉到私有 hook；首帧同步测量、`document.fonts.ready` 补测、tablist-only ResizeObserver、1px deadzone、live-resize indicator 隐藏/禁过渡策略统一由 hook 持有，`HomeSettingsPane` 回归编排层；同时将 6 槽 trigger/CSS var 假设收口到单一常量入口。
2026-03-10: 成员清单收口为目录级地图，`cards/` 细节下沉到其独立 L2 文档，避免 workspace 父级穿透描述子模块文件。
2026-03-06: `device-card` 的分辨率注释改为本地开关 `SHOW_DEVICE_RESOLUTION_HINT=false` 控制，默认关闭；当前仅保留机型选择主路径，设备提示语义继续留在卡片标题 tooltip（`config.deviceTooltip`）。
2026-03-01: 新增 `config-actions.js`，`useHomeWallpaperConfig` 动作集合下沉为工厂；主 hook 收敛为编排层。
2026-03-01: `goal-date-updater.js` 从 `type` 分派重构为显式语义入口（range/start/date），并保留历史错误语义兼容。
2026-03-01: `useHomeWallpaperConfig` 拆分为 `config-init/goal-date-updater/url-builder/view-model-mappers` 四层，主 hook 聚焦状态编排；同时移除无效 `deviceOptions` 返回与透传链路。
2026-03-01: 新增 `workspace/config-init.js`、`workspace/goal-date-updater.js`、`workspace/url-builder.js`、`workspace/view-model-mappers.js`，用于配置初始化、Goal 日期更新、URL 生成与选项映射职责分离。
2026-02-11: 新增 preview|settings 双栏工作区，实现与左侧 style cards 的直接联动。
2026-02-11: 移除固定英文翻译器，改为使用 useI18n 提供的全局 t()。
2026-02-11: Wallpaper Language 下拉改为与顶部语言菜单一致的“国旗 + 原名”渲染语义与间距。
2026-02-13: Goal 配置新增 Start Date(goalStart)；桌面三列 1:1:1，移动端单列；手动输入与 picker 同步约束（1900~2100, start<=target）。
2026-02-14: Registry 日期输入从原生 type="date" 切换为 main 同源 react-aria DatePicker 接口接入（DOB/Goal Start/Goal Target）；本阶段仅完成功能替换，UI 精修后置。
2026-02-18: HomeSettingsPane 通过 `@/components/ui/kumo` 引用 Button/Input/Select，移除页面层对 `@cloudflare/kumo` 的直接依赖。
2026-02-18: Goal 日期硬约束统一为 `start<=target`；允许未来 Start Date 与过去 Target Date；前后端统一使用 1900-2100 范围校验。
2026-02-18: 第一阶段命名收口：`useHomeWallpaperConfig` / `HomePreviewPane` / `HomeSettingsPane` 取代 Registry* 在用导出名。
2026-02-18: 第二阶段右侧改造：引入 SettingsCardShell + 六卡 schema demo 骨架（复刻 Kumo HomeGrid 风格）；旧完整表单改为开发态 `legacySettings=1` 才挂载。
2026-02-18: 六卡右上角增加固定序号标记（①~⑥），用于步骤语义与视觉定位。
2026-02-22: 首卡（`basics`）从 Button demo 迁移为 Country Select，直接绑定 `config.country` / `actions.setCountry`；Select 宽度按原版 HomeGrid 示例对齐为 `w-[200px]`。
2026-02-22: 首卡左上角标题从组件名改回业务语义（`config.location`）并接回 `config.locationTooltip` 问号提示；卡壳支持 `titleTooltip` 可选渲染。
2026-02-22: 第二卡（`type-params`）从 Input demo 迁移为 Wallpaper Language Select，直接绑定 `config.wallpaperLang` / `actions.setWallpaperLang` 并复用 `languageOptions`（国旗 + 原名）；宽度与首卡统一为 `w-[200px]`。
2026-02-22: 前两卡进入业务ID过渡态：`basics -> location`、`type-params -> wallpaper-lang`；迁移期曾通过 legacy ID 选择器做兼容。
2026-02-22: 设置面板地基升级为 `CARD_REGISTRY + CARD_ORDER_BY_TYPE` 双层结构；渲染改为“按 type 取卡序 + 按槽位打 `①~⑥`”，业务语义与位置语义解耦，当前 `life/goal` 临时复用 `year` 顺序。
2026-02-24: 右侧卡片右上角步骤标记从空心圈号 `①~⑥` 切换为实心圈号 `➊~➏`，提升视觉识别度；仅改显示字形，不改槽位语义与编排逻辑。
2026-02-22: 第三卡（`colors`）从 Switch demo 迁移为 Year Progress Colors 配置卡：中间分为 `Background`/`Accent` 两行 `ColorPicker`，底部接入 `palettePresets`，绑定 `setBackgroundColor` / `setAccentColor` / `applyPalette`，并暂定宽度基线 `w-[200px] max-w-full`。
2026-02-22: 第四卡（`device`）从 Dropdown demo 迁移为 Device Select：接回 `config.device` / `actions.setDevice`、保留 iPhone/Android/iPad 分组，并在 Select 下方显示 `config.deviceResolution`（`selectedDevice.width × selectedDevice.height`）；本轮保持最小迁移，Annotated Select 形态继续留在 `doc/TODO.md`。
2026-02-22: Goal Countdown 启用 type 专属卡序：在槽位③插入 `goal-fields`（Goal Name + Start Date + Target Date 三排），并在 goal 顺序中移出 `palettes`；year 顺序保持不变。
2026-02-22: Goal 槽位⑥接入 `Set it` 收口流程：点击后先复制 URL，成功才在右侧设置区内滑出 `SetupGuidePanel`；根据设备类别自动分流 iOS/Android 引导，Year 5+6 合并后置到后续分支。
2026-02-23: Year 模式完成 5+6 合并：`CARD_ORDER_BY_TYPE.year` 调整为 5 卡顺序（移出 `palettes`），并将 `url` 卡在 `md+` 断点设为跨两列宽卡（槽位⑤收口）；`url` 的 Set 流程与 Goal 对齐为 `year/goal` 共用成功门控与平台分流，`life` 本轮冻结不改。
2026-02-23: Year 第⑤收口卡改为“URL + Set 同排锚点”布局：`md+` 使用双列轨道对齐左右内容边界（URL 左锚点、Set 右锚点），小屏回落两行；本次仅影响 year，goal 第⑥卡样式保持不变。
2026-02-23: Year 第⑤收口卡进一步改为“紧凑同排”布局：移除 `md:grid-cols-2` 双列拉开，改为单容器 `md:flex-row`（`md:w-[420px]`）以缩小 URL 与 Set 间距；小屏继续两行，Goal/Life 不变。
2026-02-23: 根据视觉复审回调，Year 第⑤收口卡恢复左右边界锚点（`md:px-[calc(25%-100px)]`）并将 URL/Set 间距收敛为 `gap-2`（对齐上方 colors presets 间距语义）；Goal/Life 继续保持不变。
2026-02-23: Year 第⑤与 Goal 第⑥的 `Set it` 按钮统一复用官方 token hover（`variant="secondary"` + `not-disabled:hover:!bg-kumo-tint` + `transition-colors`），仅增强悬浮反馈，不改布局与交互链路。
2026-02-23: SetupGuidePanel 移除黑色遮罩层（`bg-black/30`）并收敛为仅抽屉本体可交互；关闭入口统一为右上角 `X`，不再依赖遮罩点击关闭。
2026-02-23: Setting Panel 卡片业务ID过渡态收口：删除 `CARD_REGISTRY.legacyId` 与 `data-home-settings-card-legacy`，选择器统一为 `data-home-settings-card`。
2026-02-23: Life 模式第③卡接入 `life-fields`（DOB + Lifespan），`CARD_ORDER_BY_TYPE.life` 更新为 `["location","wallpaper-lang","life-fields","colors","device","url"]`，并移出占位 `palettes`。
2026-02-23: 删除 `legacySettings=1` 与 `LegacySettingsForm` 迁移兜底分支，右侧设置区统一以六卡渲染链路为唯一入口。
2026-02-23: 将 `HomeSettingsPane` 内联卡片实现拆分到 `workspace/cards/*`，`HomeSettingsPane` 仅保留卡序编排、视图模型组装与 Set-it 成功门控；UI/UX 与交互行为保持不变。
2026-02-28: Life 第③卡 DOB 从本地 react-aria 日期壳切到官方 Kumo DatePicker(single)+Popover；本地 `settings-card-date-picker-field` 与 `ui/calendar|date-picker|datefield` 链路下线。
2026-02-23: Goal 第③卡日期输入从双字段（Start/Target）切换为单一 Date Range：使用官方 Kumo `DatePicker(mode="range")` + presets(`Next 30/90 days`)，并新增 `actions.setGoalRange` 原子状态入口；URL 继续输出 `goalStart/goal`。
2026-02-24: Device 选择入口临时收口为 iPhone-only：`device-card` 仅渲染 iPhone 分组；`useHomeWallpaperConfig` 对历史 Android/iPad 设备值做启动期回退到首个 iPhone，可见入口与状态保持一致（设备数据与 Worker 参数链路保留）。
2026-02-24: 新增 `device-visibility.js` 作为设备可见性策略单一真相源，`device-card` 与 `useHomeWallpaperConfig` 改为共享常量/判断函数，消除跨文件重复定义导致的策略漂移风险。
2026-02-24: SetupGuidePanel 的 iOS 第3步改为结构化渲染：`Get Contents of URL` 使用 Kumo `ClipboardText`（Long Text）并绑定 `HomeSettingsPane` 透传的同源 `url`，宽度控制为当前容器约 3/4；不再依赖写死 URL 文案。
2026-02-24: SetupGuidePanel 的 iOS 第3步 `ClipboardText` 尺寸从 `lg` 调整为 `base`，与 Setup 收口卡 URL 输入框高度对齐（36px），消除步骤间控件高度不一致。
2026-02-24: SetupGuidePanel 顶部标题从双行（`Setup` + 平台副标题）改为单行平台标题（`iOS Setup` / `Android Setup`），减少视觉跳行并提升标题识别速度。
2026-02-25: `useHomeWallpaperConfig` 新增 `foregroundOverride` 状态（null=自动, #FFF=亮, #000=暗）+ `setForegroundOverride/resetForeground` 动作 + URL fg 参数序列化。
2026-02-25: SetupGuidePanel 步骤卡从原生 `<article>` 迁移到 Kumo `<Surface>` 组件，提取重复样式为 `STEP_CARD_SURFACE_CLASSNAME`/`STEP_INDEX_BADGE_CLASSNAME`/`STEP_DESC_TEXT_CLASSNAME` 常量。
2026-05-05: SetupGuidePanel 步骤卡外壳从 Kumo 2 deprecated `Surface` 迁移到 `LayerCard`，保留原有 class 常量样式语义与滚动职责。
2026-02-25: Goal 日期状态更新逻辑收敛：`setGoalRange/setGoalStart/setGoalDate` 改为统一委托 `applyGoalDateUpdate`，仅做内部去重重构，保持外部 actions 签名、URL 序列化与 UI/UX 行为不变。
2026-02-25: Setup flow 状态从 `HomeSettingsPane` 上提到 `HomeGrid`，并在 `md` 新增整区 Guide 宿主（覆盖 HomeGrid 边界，`h-[calc(100dvh-48px)]`）；`HomeSettingsPane` 保留 `sm/lg` 宿主（`md:hidden lg:block`），`SetupGuidePanel` 新增宿主样式注入 props 以复用同一动画与步骤渲染。
2026-02-26: SetupGuidePanel 收敛滚动职责：外层容器固定 `overflow-hidden overscroll-none`，仅内容区 `overflow-y-auto overscroll-y-contain` 可滚；补充 `role="dialog"`/`aria-modal` 语义，消除外层滚动链串扰。
2026-02-26: 引入 Skeleton Base + AutoFlow：`HomePage` 初始 `selectedStyle=null`，`useHomeWallpaperConfig` 支持空态类型；`HomeGrid` 新增浏览器级一次的 `revealStage` 自动解锁（200ms/卡）与未解锁卡快进；`HomePreviewPane`/`HomeSettingsPane` 使用官方 `SkeletonLine` 渲染空态与未解锁占位，Year 保持 5 卡收口布局不变。
2026-03-04: HomeSettingsPane 接入 `effectiveLayoutTier`，将容器高度/滚动与 Guide 宿主显隐从静态 `lg:*` 断点切换为业务层级驱动，支持 `1024~1314 + 侧栏打开` 强制 md 语义。
2026-03-04: 修复“强制 md 但卡片高度仍走 lg”回归：`SettingsCardShell` 新增 `compactAtDesktop`，`HomeSettingsPane` 在非 effective lg 场景禁用 `lg:min-h-0`，恢复原生 md 卡高。
2026-03-04: 新增 `mid` 中间态：`1024~1314 + 侧栏打开` 时保持 LG 壳层，仅将 Setting Panel 从双列改为单列，按 `selectedType` 等分行数（year=5；goal/life/空态=6），并在 mid 下关闭 year 的 `url` 跨列类。
2026-03-04: Year 第⑤ + Goal 第⑥ URL 收口卡新增 `mid` 专用抗挤压布局：锚点对齐标题 `left-4` 与序号 `right-4`，固定 `gap-2`，仅输入框收缩、按钮保持 `shrink-0`，避免窄窗时溢出。
2026-03-04: SetupGuidePanel 关闭态隔离升级：`aside` 增加 `inert` 与 `aria-hidden`，`aria-modal` 仅在打开态暴露；同时 Set-it 链路透传触发元素，由 HomeGrid 在关闭后执行焦点回退，避免键盘用户丢焦点。
2026-03-04: HomeSettingsPane 的 Guide 挂载改为条件渲染（`effectiveLayoutTier !== "md"` 才挂载），移除仅用于隐藏另一宿主的 `visibilityClassName` 分支，实现与 HomeGrid 的单宿主互斥。
2026-03-04: Guide 挂载规则再收敛：HomeSettingsPane 不再自行判断 tier，改为消费 HomeGrid 透传 `shouldRenderPaneGuideHost`，保证跨文件判定单一真相源。
2026-03-09: 撤回 `settingsLayoutTier` 抽象；HomeSettingsPane 恢复直接消费 `effectiveLayoutTier`，由 HomeGrid 在真 `md + 抽屉关闭` 时局部传入 `mid`，从而直接复用原有 mid 分支并减少语义漂移。
2026-03-09: `md + drawer open` 新增底部 segmented tabs 模式：HomeGrid 收口 `useMdBottomTabsLayout` 并将 workspace 壳改为“预览自然高 + settings 吃剩余高度”；HomeSettingsPane 改为根级分流 `bottom-tabs/grid`，active tab 仅保留用户意图 state，真实渲染 tab 由 `availableTabs` 纯派生，避免 `useEffect` 回写同步陷阱。
2026-03-09: `md + drawer open` 的底部 tabs 宽度语义升级：新增 `md-bottom-tabs-widths.js` 算法层，按“自然宽总和 vs 容器宽”的差值做余量均分，或按“最长项先压到次长项、压平后再联动收缩”分配窄窗宽度；HomeSettingsPane 改为隐藏测量 Kumo 默认 segmented 自然宽，再通过容器 CSS 变量 + trigger 级 `width/flex-basis` className 把目标宽度直接写到 Kumo trigger 本体，保留官方药丸高度与灰底而不再使用 label 假宽度或恒等宽 `flex-1`。
2026-03-09: `md + drawer open + selectedType === null` 的空态语义改为 bottom-tabs：HomeGrid 不再用 `Boolean(selectedType)` 阻断该模式；HomeSettingsPane 改为显示六项全量 tabs 与单卡 skeleton，不再回退 6 格 grid，也不再用 `revealStage` 逐项解锁空态 tabs。
2026-03-09: `md + drawer open` 的底部 tabs 壳层改为常驻：空态时左上标题与全部 tab label 先显示 `SkeletonLine`；选中 style 后不再重挂载 tabs 容器，而是仅按 `revealStage` 逐项解开 tab label，并仅在当前 active tab 已解锁时显示真实标题与 tooltip。
2026-03-09: HomeSettingsPane 新增 `useAnchoredSetupRow` 视图语义并下发到 `url-card`，让 `md + drawer open` bottom-tabs 下的第⑥卡复用 `mid` 的紧凑锚点行（输入框先缩、按钮右锚且不缩），消除同一收口问题在不同 tier 名字下分裂成两套布局的坏味道。
2026-03-09: 修复 md bottom-tabs 首屏 pill 偶发过窄与拖窗卡顿：首次宽度初始化改为 `useLayoutEffect` 同步落值，不再延后一帧；自然宽测量缓存到 ref，resize 仅重算 tablist 宽；拖动期间通过 Kumo `indicatorClassName` 暂时关闭 active pill 过渡，停止拖动后恢复点击切 tab 动画。
2026-03-10: HomeSettingsPane 的布局分流 prop 从 `useMdBottomTabsLayout` 收口为 `useSegmentedWorkspaceLayout`；`mobile + md drawer open` 统一复用现有 bottom-tabs 视图，`useAnchoredSetupRow` 语义同步扩展到 mobile segmented，而 tabs 文件实现保持不变。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
