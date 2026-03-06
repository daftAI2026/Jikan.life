# pages/registry/
> L2 | 父级: /src/pages/CLAUDE.md

成员清单
HomePage.jsx: Home 根页面，维护 selectedStyle（初始空态）+ sidebarOpen + viewportWidth 状态，计算 effectiveLayoutTier 并向工作区透传 `effectiveLayoutTier/sidebarOpen`（`mid` 复用桌面壳层；md guide 宿主避让 style 抽屉）
effective-layout-tier.js: 有效布局层级判定单一真相源，封装 `768/1024/1314` 阈值与“`1024~1314 + 抽屉打开 => mid`”规则
registry-data.js: Registry 旧版导航与示例数据（备用）
sections/HomeTopbar.jsx: 顶栏区域，支持 hideLanguage（侧栏收起时隐藏左侧语言切换），右侧展示 GitHub 与小红书社交入口
sections/MobileFooter.jsx: 移动端底部栏（左 GitHub / 中语言切换 / 右小红书），复用顶部轨道宽度保证左右边界对齐
sections/HomeSidebar.jsx: 本地侧栏，支持 sidebarOpen/onSidebarOpenChange 受控开合，保留 Kumo 动效并向工作区分发 style 选择
sections/ThemeToggle.jsx: Home 本地主题切换按钮（light/dark），写入 data-mode 与 localStorage
sections/LanguageSelect.jsx: Home UI 语言切换组件（触发器为线框地球图标+语言名；菜单为国旗+语言名并保留默认选中勾；桌面挂载于顶栏左侧，移动端挂载于底部 footer 中置入口）
sections/SearchDialog.jsx: Home 搜索入口占位组件（兼容 open/onOpenChange 接口）
sections/JikanMenuIcon.jsx: Home 本地菜单动效图标（避免跨包引用上游 docs 源码）
sections/home-sidebar-cards.jsx: HomeSidebar 卡片层，封装 year/life/goal 卡片数据构造、过滤策略与渲染循环
sections/home-sidebar-visuals.jsx: HomeSidebar 视觉层，封装 Year/Life/Goal 三类卡片预览
sections/home-sidebar-date-stats.js: HomeSidebar 日期统计层，封装 yearStats 计算与 Goal 预览布局生成
sections/useRegistryBlockingScrollLock.js: Registry 阻断层滚动锁基础设施（引用计数）
sections/CLAUDE.md: sections 子模块文档
sections/components/HomeGrid.jsx: preview|settings 双栏工作区编排层（含 Skeleton Base 首次 AutoFlow stage 管理）
sections/workspace/useHomeWallpaperConfig.js: 双栏工作区状态核心与 URL 生成逻辑
sections/workspace/config-actions.js: 配置动作工厂层，统一 set*/apply*/copyUrl 状态更新语义
sections/workspace/config-init.js: 配置初始化层，默认配置、类型映射与颜色归一
sections/workspace/goal-date-updater.js: Goal 日期状态层，range/start/date 三个语义入口
sections/workspace/url-builder.js: URL 构建层，year/life/goal 参数序列化
sections/workspace/view-model-mappers.js: 视图模型映射层，国家/语言选项与调色板组装
sections/workspace/device-visibility.js: 设备可见性策略单一真相源
sections/workspace/HomePreviewPane.jsx: 左侧手机预览画布（支持空态 Skeleton 引导）
sections/workspace/HomeSettingsPane.jsx: 右侧六卡设置面板编排层（负责卡序、Skeleton Base 渐进解锁与 Set-it 门控），业务卡实现下沉到 cards 子模块
sections/workspace/SettingsCardShell.jsx: 右侧卡片统一壳组件，复刻 Kumo HomeGrid 单卡结构
sections/workspace/SetupGuidePanel.jsx: Goal 第⑥卡后的局部覆盖式设置引导层（右侧滑入）
sections/workspace/CLAUDE.md: 双栏工作区子模块文档
sections/workspace/cards/index.js: Setting Panel 业务卡聚合入口（导出 CARD_REGISTRY）
sections/workspace/cards/CLAUDE.md: Setting Panel 业务卡子模块文档
sections/components/ComponentGrid.jsx: 旧版组件墙网格（备用）
sections/components/ComponentCell.jsx: 旧版网格单元壳（备用）
sections/components/ComponentData.js: 旧版网格条目数据（备用）
sections/components/CLAUDE.md: 组件网格子模块文档
sections/RegistryHeader.jsx: 旧版顶栏（保留备用）
sections/RegistryOverview.jsx: 旧版概览区（保留备用）
sections/RegistryBlocks.jsx: 旧版 Blocks 区（保留备用）
sections/RegistryComponents.jsx: 旧版组件展示区（保留备用）
sections/RegistrySection.jsx: 旧版区块包装器

结构
registry/ - Kumo UI 单页模块 (sections + HomePage + effective-layout-tier + registry-data)

架构决策
ThemeToggle/SearchDialog/JikanMenuIcon 全部改为本地实现；Sidebar 与 HomeGrid 维持本地受控实现，彻底切断对上游 docs 源码的构建期耦合。
页面层统一通过 `@/components/ui/*` 引用 Kumo 组件；禁止 `src/pages/registry/**` 直接 import `@cloudflare/kumo`。

开发规范
只使用 `@/components/ui/*` 统一入口组件与 Kumo token，禁止引入其他设计系统组件。

变更日志
2026-02-10: 新增 Kumo 首页复刻组件与布局模块。
2026-02-11: 曾改为上游组件同源挂载路径，移除手写实现偏差（历史记录）。
2026-02-11: 首页改造为 preview|settings 双栏，新增 workspace 子模块并实现 style cards 联动。
2026-02-11: 新增 LanguageSelect 入口并将 Registry UI 文案切换为 useI18n 驱动；语言控件迁移到顶栏左侧，触发器改为“线框地球图标+语言名”，菜单保持“国旗+语言名”并保留默认选中勾。
2026-02-12: 移除 Registry 对上游 docs 站组件源码的直接引用，修复 CI 构建被 Astro tsconfig 依赖阻塞的问题。
2026-02-18: 页面层组件引用统一收敛到 `@/components/ui/*`，移除 `src/pages/registry/**` 的 `@cloudflare/kumo` 直引。
2026-02-18: 第一阶段入口收口：下线 Landing，`/app` 改为重定向 `/`，核心在用文件改名为 Home*（目录保持 registry）。
2026-02-23: workspace 设置面板完成“编排层/业务卡层”拆分，新增 `sections/workspace/cards/*` 子模块并保持现有 UI/UX 与行为不变。
2026-02-26: 首页工作区切到“空态先行”流程：`HomePage` 初始 `selectedStyle=null`，HomeGrid/workspace 新增官方 SkeletonLine 引导与首次 AutoFlow 渐进解锁（浏览器级一次）。
2026-03-04: 移动端新增底部 footer（高度与顶部栏一致）：左 GitHub / 中语言切换 / 右小红书；主内容移动端高度改为扣除 topbar + footer，避免底部遮挡。
2026-03-04: `HomePage` 移动端 footer 抽离为 `sections/MobileFooter.jsx`，页面层仅保留编排职责，底栏实现独立维护。
2026-03-04: 新增 `effective-layout-tier.js` 并接入 `HomePage -> HomeGrid -> HomeSettingsPane`：当抽屉打开且 `window.innerWidth<=1314` 时，`1024+` 视口按 md 语义渲染；抽屉关闭保持 lg 语义。
2026-03-04: 有效布局层级扩展 `mid`：`1024~1314 + 侧栏打开` 保持 LG 壳层，仅将 Setting Panel 切换为单列等分行（year=5、goal/life/空态=6）。
2026-03-07: `HomePage` 继续向 `HomeGrid` 透传 `sidebarOpen`；真 `md` 下 SetupGuide 宿主左边界随 style 抽屉开关切换，抽屉打开时避让 `Choose your style` 面板，不再整块覆盖。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
