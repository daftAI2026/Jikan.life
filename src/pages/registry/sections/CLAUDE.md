# sections/
> L2 | 父级: /src/pages/registry/CLAUDE.md

成员清单
HomeTopbar.jsx: 顶栏区域（仅 md+ 渲染），支持 hideLanguage（侧栏收起时隐藏左侧语言切换），右侧展示 GitHub 与小红书社交入口
MobileFooter.jsx: 移动端底部栏（仅 md 以下渲染），三段布局为左 GitHub / 中语言切换 / 右小红书，并复用顶部轨道宽度对齐
HomeSidebar.jsx: 本地侧栏布局容器层，负责侧栏开合交互、移动端抽屉滚动锁与卡片层挂载（支持 sidebarOpen/onSidebarOpenChange 受控接口）
home-sidebar-cards.jsx: HomeSidebar 卡片层，封装 year/life/goal 卡片数据构造、过滤策略与渲染循环
home-sidebar-visuals.jsx: HomeSidebar 视觉层，封装 Year/Life/Goal 三类卡片预览（Year 10x10 点阵、GoalVisual 文本定位参数）
home-sidebar-date-stats.js: HomeSidebar 日期统计层，封装 yearStats 计算与 Goal 预览布局生成（日期数学复用 `@/lib/date-utils`）
ThemeToggle.jsx: Home 本地主题切换按钮（light/dark），写入 data-mode 与 localStorage
LanguageSelect.jsx: Home UI 语言切换组件（触发器为“线框地球图标+语言名”，菜单为“国旗+语言名”且保留默认选中勾，二者间距统一；桌面顶栏左侧挂载，移动端挂载于底部 footer 中置入口）
SearchDialog.jsx: Home 搜索入口占位组件（兼容 open/onOpenChange 接口）
JikanMenuIcon.jsx: Home 本地菜单动效图标（避免跨包引用上游 docs 源码）
useRegistryBlockingScrollLock.js: Registry 阻断层滚动锁基础设施（引用计数），统一控制 `data-registry-blocking` 标记
RegistryHeader.jsx: 旧版顶栏（保留备用）
RegistryOverview.jsx: 旧版概览区（保留备用）
RegistryBlocks.jsx: 旧版 Blocks 区（保留备用）
RegistryComponents.jsx: 旧版组件展示区（保留备用）
RegistrySection.jsx: 旧版区块包装器

架构决策
sections 页面层统一通过 `@/components/ui/*` 引用 Kumo 组件；`cn` 工具统一来自 `@/lib/utils`。
第一阶段命名收口仅覆盖在用链路（HomeTopbar/HomeSidebar），备用旧文件保持原名，避免一次性扩大改动面。
滚动治理采用“阻断层单一滚动源”策略：阻断层打开时通过 `useRegistryBlockingScrollLock` 统一锁背景滚动，避免多滚动源串扰。
HomeSidebar 采用“容器/卡片/视觉/统计”四层拆分：容器只管布局与状态桥接，卡片层只管 style cards 渲染，视觉只管预览渲染，统计只管日期计算与布局数据。

变更日志
2026-03-01: 新增 `home-sidebar-cards.jsx`，从 `HomeSidebar.jsx` 下沉卡片数据与渲染循环；`HomeSidebar` 收敛为纯布局容器。
2026-03-04: 移动端壳层新增底部 footer（左 GitHub / 中语言 / 右小红书），并与顶部 ThemeToggle 形成对称边界；LanguageSelect 不再使用右下角浮动挂载。
2026-03-04: 新增 `MobileFooter.jsx`，将移动端 footer 从 `HomePage` 抽离为独立组件，页面层只负责挂载。
2026-02-26: HomeTopbar 顶层容器收敛为 `hidden md:block`，移动端仅保留 HomeSidebar 的固定顶栏，消除顶部双边线叠加。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
