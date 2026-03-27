# sections/
> L2 | 父级: /src/pages/registry/CLAUDE.md

成员清单
HomeTopbar.jsx: 顶栏区域（仅 md+ 渲染），支持 hideLanguage（侧栏收起时隐藏左侧语言切换），右侧展示 GitHub 与小红书社交入口
MobileFooter.jsx: 移动端底部栏（仅 md 以下渲染），默认三段布局为左 GitHub / 中语言切换 / 右小红书；支持 `fixed=false` 后也可作为 sidebar tabs 下方的真实 footer
HomeSidebar.jsx: 本地侧栏布局容器层，负责侧栏开合交互、移动端抽屉滚动锁与卡片层挂载（支持 sidebarOpen/onSidebarOpenChange 受控接口，并在移动端分离 viewingStyle 与 selectedStyle；品牌字样使用非标题标签，避免占用页面唯一 H1）
home-sidebar-cards.jsx: HomeSidebar 卡片层，封装 year/life/goal 卡片数据构造、过滤策略与渲染循环；Year/Goal 卡统计文案委托 date-stats helper 决策单行语义，其中 Year 左侧 inline 文案当前只显示 day 句式，并在日文混排场景通过本地 mixed-text helper 显式拆分数字/英文与日文 run，移动端 tabs 只负责查看卡片，真正选中仍由卡片点击提交
home-sidebar-mixed-text.js: HomeSidebar 本地 mixed-text helper，仅处理 Year 卡日文混排句式，把 ASCII run 与日文 run 显式分段，供卡片层局部指定 `Noto Sans JP`
home-sidebar-style-cards.js: HomeSidebar 卡片语义层，封装隐藏卡过滤与移动端 active style 回退真相源
home-sidebar-visuals.jsx: HomeSidebar 视觉层，封装 Year/Life/Goal 三类卡片预览（Year 10x10 点阵、GoalVisual 文本定位参数）
home-sidebar-date-stats.js: HomeSidebar 日期统计层，封装 yearStats 计算（含动态年份）、Year/Goal 卡统计文案语义与 Goal 卡片预览专用布局真相源（Year 复用 `src/lib/date-utils.js`，Goal 标签文案复用 `shared/wallpaper-text.js`）
ThemeToggle.jsx: Home 本地主题切换按钮（light/dark），写入 data-mode 与 localStorage
LanguageSelect.jsx: Home UI 语言切换组件（触发器为“线框地球图标+语言名”，菜单为“国旗+语言名”且保留默认选中勾，二者间距统一；桌面顶栏左侧挂载，移动端挂载于底部 footer 中置入口）
SearchDialog.jsx: Home 搜索入口占位组件（兼容 open/onOpenChange 接口）
JikanMenuIcon.jsx: Home 本地菜单动效图标（避免跨包引用上游 docs 源码）
useRegistryBlockingScrollLock.js: Registry 阻断层滚动锁基础设施（引用计数），统一控制 `data-registry-blocking` 标记
components/: 当前主页工作区编排子模块，仅承载 HomeGrid（详见 components/CLAUDE.md）
workspace/: 双栏工作区子模块，承载配置状态、预览面板、设置面板与业务卡（详见 workspace/CLAUDE.md）

架构决策
sections 页面层统一通过 `@/components/ui/*` 引用 Kumo 组件；`cn` 工具统一来自 `@/lib/utils`。
第一阶段命名收口最初只覆盖在用链路（HomeTopbar/HomeSidebar）；2026-03-27 起，旧 Registry demo 区块与包装器正式删除，sections 层只保留当前 Home 运行链与测试要求的 SearchDialog 占位契约。
滚动治理采用“阻断层单一滚动源”策略：阻断层打开时通过 `useRegistryBlockingScrollLock` 统一锁背景滚动，避免多滚动源串扰。
HomeSidebar 采用“容器/卡片/视觉/统计”四层拆分：容器只管布局与状态桥接，卡片层只管 style cards 渲染，视觉只管预览渲染，统计只管日期计算与布局数据。
移动端 style selector 采用“单卡主视觉 + 底部 segmented tabs”语义：桌面继续保留多卡列表，移动端切到固定 tabs rail + 单卡内容区，避免矮屏设备把主视觉压扁。

变更日志
2026-03-27: 删除 `RegistryHeader/Overview/Blocks/Components/Section` 旧 demo 区块链路；`sections/` 回到纯 Home 运行层，只保留 `SearchDialog.jsx` 作为测试锁定的占位接口。
2026-03-26: `HomeSidebar.jsx` 的 3 处品牌字样从 `h1` 降为普通文本标签，首页唯一 H1 改由最小离屏 SEO 语义层与运行时离屏 H1 承载；保持现有 class、布局与交互不变。
2026-03-16: 新增 `home-sidebar-style-cards.js`，将隐藏卡过滤与 active style 回退收口为纯 helper；`HomeSidebar` 移动端切到 segmented 单卡布局并复用 Kumo `Tabs` 固定底栏高度，桌面侧栏保持原多卡列表。`MobileFooter.jsx` 同步支持 `fixed=false`，作为 sidebar tabs 下方的真实 footer 行挂载。
2026-03-16: 移动端 style sidebar 将 `viewingStyle` 与 `selectedStyle` 解耦；底部 tabs 仅切换卡片查看器，不再直接写全局选中状态，真正选中改回卡片点击提交。
2026-03-21: `home-sidebar-date-stats.js` 新增 `getYearSidebarStats()` 与 `getGoalSidebarStats()`，把 Year 卡英文统计收口为两列单行 `Day 80` / `22% Complete`、把 Goal 卡英文统计收口为两列单行 `Target` / `Daily tracking`；`home-sidebar-cards.jsx` 对英文 inline stat 统一使用“不可见双行占位 + 绝对定位居中层”，维持原双行 stat 的两横线间距，并让单行内容在原 stat 高度内垂直居中；两列模式同时移除中间竖线，保持左列左对齐、右列整体右对齐，同时避免 Goal/Life 卡被统一高度策略误伤。
2026-03-21: `getYearStats()` 继续保留 `year` 输出供后续句式扩展，但 Year 卡当前不渲染标题右侧年份，也不把年份并入左侧 inline 文案；英文回到 `Day 80`，简中/繁中回到 `第 80 天`，日文回到 `80 日目`，统一隐藏年份与连接标点。
2026-03-21: 新增 `home-sidebar-mixed-text.js`，只对 Year 卡日文混排文本（`2026 年度進捗`、`80 日目`、`22% 経過`）做本地 run 拆分；ASCII 数字/英文继续继承 `--font-sans`，日文 run 显式指定 `Noto Sans JP`，不外溢到 Goal 卡、壁纸链路或全局 i18n 结构。
2026-03-01: 新增 `home-sidebar-cards.jsx`，从 `HomeSidebar.jsx` 下沉卡片数据与渲染循环；`HomeSidebar` 收敛为纯布局容器。
2026-03-04: 移动端壳层新增底部 footer（左 GitHub / 中语言 / 右小红书），并与顶部 ThemeToggle 形成对称边界；LanguageSelect 不再使用右下角浮动挂载。
2026-03-04: 新增 `MobileFooter.jsx`，将移动端 footer 从 `HomePage` 抽离为独立组件，页面层只负责挂载。
2026-02-26: HomeTopbar 顶层容器收敛为 `hidden md:block`，移动端仅保留 HomeSidebar 的固定顶栏，消除顶部双边线叠加。
2026-03-10: 成员清单补回 `components/` 与 `workspace/` 目录级入口，父级地图同时保留直属文件职责，避免子模块在目录层失踪。
2026-03-14: `home-sidebar-date-stats.js` 的 Goal 样卡布局从正式 `computeGoalLayout()` 脱钩，改为 sidebar preview 专用真相源；圆环半径扩到 `34.5`，并同步放大 `69` 与标签字号，避免样卡继续依赖正式锁屏构图语义。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
