# components/
> L2 | 父级: /src/pages/registry/sections/CLAUDE.md

成员清单
HomeGrid.jsx: Registry 主工作区编排层，承载 preview|settings 与 selectedStyle/effectiveLayoutTier/sidebarOpen 联动，并上提 Set-it 流程状态（copy success 后平台分流）、首次 AutoFlow `revealStage` 与 Guide 宿主；外层桌面壳启用由 helper 决定，真 `md` 仅在抽屉打开时使用整区 Guide 宿主与 bottom-tabs 壳（空态也进入），抽屉关闭时只在 pane 局部复用 mid 路径
ComponentCell.jsx: 网格单元壳，负责标题与内容排布
ComponentGrid.jsx: 旧版组件墙网格（备用）
ComponentData.js: 旧版网格条目数据（备用）

结构
components/ - 组件墙子模块 (4 files)

架构决策
HomeGrid 从 vendor 薄包装切换为本地编排实现；旧网格模块继续保留备用，不参与当前页面渲染。

开发规范
只使用 `@/components/ui/*` 统一入口组件与 Kumo token，禁止引入 shadcn 子组件或自定义颜色。

变更日志
2026-02-10: 新增 HomeGrid 复刻 Kumo 首页组件墙。
2026-02-11: HomeGrid 曾改为上游组件薄包装挂载（历史）。
2026-02-11: HomeGrid 改为本地双栏工作区编排，接入 workspace 子模块。
2026-02-18: ComponentCell/ComponentGrid 改为通过 `@/components/ui/kumo` 引用 Kumo 组件，移除页面层直引上游包。
2026-02-25: HomeGrid 上提 Setup flow 状态（`isSetupPanelOpen/setupPlatform`）并新增 `md` 专用整区 Guide 宿主（`hidden md:block lg:hidden` + `h-[calc(100dvh-48px)]`），保持中档覆盖范围与 viewport 同步。
2026-02-26: HomeGrid 接入 `useRegistryBlockingScrollLock`，SetupGuide 打开时统一锁背景滚动；md 宿主继续固定覆盖，但容器显式收敛为 `overflow-hidden overscroll-none`，避免外层参与滚动链。
2026-02-26: HomeGrid 移动主容器补充 `overscroll-y-contain`，与页面级 `overflow-y: hidden` 协同，避免触控板/双指下拉将滚动链泄漏到 viewport。
2026-02-26: HomeGrid 新增 Skeleton Base AutoFlow（`AUTOFLOW_STORAGE_KEY=registry.settingsAutoflow.v1`、200ms/卡），首次选型后 `revealStage` 自动递进；点击未解锁卡可快进全解锁，后续进入直接全开。
2026-03-04: HomeGrid 新增 `effectiveLayoutTier` 输入并改为条件化 md/lg 渲染：双栏与 Guide 宿主显示不再直接依赖 `lg:*` 屏宽断点，可在 `1024~1314 + 侧栏打开` 强制走 md 语义。
2026-03-04: HomeGrid 新增 `mid` 壳层语义：`1024~1314 + 侧栏打开` 仍保留 preview/settings 双栏与 LG Guide 宿主，仅把 Setting Panel 内部降为单列。
2026-03-04: HomeGrid 的 Set-it 触发链路新增“关闭后回焦”语义：记录触发按钮元素并在 `handleCloseSetupPanel` 关闭后一帧 `focus({ preventScroll: true })` 回退，保证键盘流程连续。
2026-03-04: HomeGrid 的 SetupGuidePanel 挂载收敛为单宿主策略：仅当 `effectiveLayoutTier === "md"` 时渲染 md 固定覆盖宿主，避免与 HomeSettingsPane 双挂载造成语义重复。
2026-03-04: Guide 宿主判定收敛为 HomeGrid 单一真相源：新增 `shouldRenderPaneGuideHost = !shouldRenderGridGuideHost` 并透传给 HomeSettingsPane，移除跨文件重复 tier 条件。
2026-03-07: HomeGrid 新增 `sidebarOpen` 输入；真 `md` 下 md Guide 宿主左边界改为按抽屉开关切换，打开时使用 `rail + sidebar panel width` 避让 `Choose your style`，关闭时保持原 `rail` 起点。
2026-03-09: HomeGrid 保留 `shouldUseDesktopWorkspaceShell`，并在组件内部新增局部 `paneEffectiveLayoutTier`；真 `md + 抽屉关闭` 时切回桌面双栏壳且右侧 pane 直接复用 mid 路径，顶层页面语义不再被连带改写。
2026-03-09: HomeGrid 的 `useMdBottomTabsLayout` 不再依赖 `selectedType`；真 `md + 抽屉打开` 的空态也直接进入 bottom-tabs 壳，交由 HomeSettingsPane 渲染“全量 tabs + 单卡 skeleton”。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
