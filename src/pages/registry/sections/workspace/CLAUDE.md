# workspace/
> L2 | 父级: /src/pages/registry/CLAUDE.md

成员清单
useHomeWallpaperConfig.js: 工作区状态编排核心，管理 selectedStyle 联动、生命周期、设备可见性与 URL 桥接；动作层委托 `config-actions.js` 生成（UI 文案跟随全局 i18n）
config-actions.js: 配置动作工厂层，统一 `set*/apply*/copyUrl` 状态更新语义与 Goal 日期动作委托
config-init.js: 配置初始化层，统一默认配置、类型映射与颜色归一（`resolveSelectedType/getInitialConfig/resolvePalette`）
goal-date-updater.js: Goal 日期状态层，导出 `applyGoalRangeUpdate/applyGoalStartUpdate/applyGoalDateUpdate` 三个语义入口并复用统一验证流水线
url-builder.js: URL 构建层，统一 year/life/goal 参数序列化与 Goal 日期校验
view-model-mappers.js: 视图模型映射层，统一国家/语言选项与调色板 presets 组装
device-visibility.js: 设备可见性策略单一真相源，统一导出可见分类集合与主分类常量，供渲染层与状态层共享。
HomePreviewPane.jsx: 左侧手机预览面板，支持“未选风格 SkeletonLine 引导态”与 Canvas 实时壁纸渲染切换。
HomeSettingsPane.jsx: 右侧设置面板主容器；负责卡片顺序编排、6 站位空态 Skeleton Base、按 `revealStage` 渐进解锁与未解锁卡快进，并按 `effectiveLayoutTier` 切换 md/mid/lg 内部栅格与 Guide 宿主；`mid` 场景改为单列等分行（year=5，goal/life/空态=6）；业务卡定义统一下沉到 `cards/`（year 模式 5 卡且槽位⑤为 `url` 收口宽卡；goal/life 模式槽位③为专属字段卡且槽位⑥保留 Set 收口），导出 `SETTINGS_CARD_IDS`
SettingsCardShell.jsx: 右侧卡片统一壳组件，复刻 Kumo HomeGrid 单卡结构（可选左上标题 + 可选问号提示 + 右上序号 ➊~➏ + 中央内容）并提供 `data-home-settings-card` 业务选择器；支持 `className` 承接 type 专属跨列布局，并通过 `compactAtDesktop` 控制是否启用 `lg:min-h-0`
SetupGuidePanel.jsx: Goal 第⑥卡后的局部覆盖式设置引导层（右侧滑入），按设备类别自动分流 iOS/Android 步骤并承载关闭交互；支持 `containerClassName/asideClassName/visibilityClassName` 宿主样式注入以复用到 HomeGrid 的 md 整区覆盖场景；iOS 第3步使用 ClipboardText 展示与 URL 卡同源的长链接；步骤卡统一使用 Kumo Surface 组件与提取常量化 className，并收敛为“仅步骤区滚动”。
cards/index.js: Setting Panel 业务语义聚合入口，导出 `CARD_REGISTRY`
cards/CLAUDE.md: Setting Panel 业务卡子模块文档（location/wallpaper/goal/life/colors/device/url）

结构
workspace/ - Home 双栏工作区子模块 (11 files + cards/ 子目录)

架构决策
采用“状态 hook + 左右面板”分层，HomeGrid 负责工作区编排并统一持有 Set-it 流程状态与 AutoFlow stage（浏览器级一次引导）。右侧设置区采用“card registry（业务语义）+ card order by type（位置编排）+ 壳组件”模式，把“卡片是谁”和“卡片放哪”彻底解耦。业务语义实现下沉到 `cards/*`，`HomeSettingsPane` 仅保留顺序编排、空态骨架与 sm/lg Guide 宿主。`➊~➏` 固定为槽位 UX 编号，不承载业务语义。当前 `year` 启用 5 卡顺序并将槽位⑤扩为收口宽卡；`goal` 启用独立 6 卡顺序（槽位③为 `goal-fields`，槽位⑥为 `url` 收口）；`life` 启用独立 6 卡顺序（槽位③为 `life-fields`，槽位⑥为 `url` 收口）。

开发规范
只使用 Kumo token 与 `@/components/ui/*` 组件语义；任何配置字段新增必须同步更新 hook 输出和右侧表单映射，并同步 URL 参数链路。

变更日志
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
2026-02-25: Goal 日期状态更新逻辑收敛：`setGoalRange/setGoalStart/setGoalDate` 改为统一委托 `applyGoalDateUpdate`，仅做内部去重重构，保持外部 actions 签名、URL 序列化与 UI/UX 行为不变。
2026-02-25: Setup flow 状态从 `HomeSettingsPane` 上提到 `HomeGrid`，并在 `md` 新增整区 Guide 宿主（覆盖 HomeGrid 边界，`h-[calc(100dvh-48px)]`）；`HomeSettingsPane` 保留 `sm/lg` 宿主（`md:hidden lg:block`），`SetupGuidePanel` 新增宿主样式注入 props 以复用同一动画与步骤渲染。
2026-02-26: SetupGuidePanel 收敛滚动职责：外层容器固定 `overflow-hidden overscroll-none`，仅内容区 `overflow-y-auto overscroll-y-contain` 可滚；补充 `role="dialog"`/`aria-modal` 语义，消除外层滚动链串扰。
2026-02-26: 引入 Skeleton Base + AutoFlow：`HomePage` 初始 `selectedStyle=null`，`useHomeWallpaperConfig` 支持空态类型；`HomeGrid` 新增浏览器级一次的 `revealStage` 自动解锁（200ms/卡）与未解锁卡快进；`HomePreviewPane`/`HomeSettingsPane` 使用官方 `SkeletonLine` 渲染空态与未解锁占位，Year 保持 5 卡收口布局不变。
2026-03-04: HomeSettingsPane 接入 `effectiveLayoutTier`，将容器高度/滚动与 Guide 宿主显隐从静态 `lg:*` 断点切换为业务层级驱动，支持 `1024~1314 + 侧栏打开` 强制 md 语义。
2026-03-04: 修复“强制 md 但卡片高度仍走 lg”回归：`SettingsCardShell` 新增 `compactAtDesktop`，`HomeSettingsPane` 在非 effective lg 场景禁用 `lg:min-h-0`，恢复原生 md 卡高。
2026-03-04: 新增 `mid` 中间态：`1024~1314 + 侧栏打开` 时保持 LG 壳层，仅将 Setting Panel 从双列改为单列，按 `selectedType` 等分行数（year=5；goal/life/空态=6），并在 mid 下关闭 year 的 `url` 跨列类。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
