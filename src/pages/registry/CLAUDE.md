# pages/registry/
> L2 | 父级: /src/pages/CLAUDE.md

成员清单
HomePage.jsx: Home 根页面，维护 selectedStyle（初始空态）+ sidebarOpen + viewportWidth 状态，计算真实 `effectiveLayoutTier + isDesktopShell` 并向工作区透传（顶层 header/main-content 保持真实 tier 语义）
effective-layout-tier.js: 布局判定单一真相源，封装 `768/1024/1314` 阈值，并导出真实 tier、desktop shell 与 segmented workspace helper
registry-data.js: Registry 旧版导航与示例数据（备用）
sections/: Registry 页面子模块目录，承载页面壳层、Sidebar/Topbar、工作区编排与旧版备用区块（详见 sections/CLAUDE.md）

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
2026-03-09: 收回 `settingsLayoutTier` 抽象；`HomeGrid` 内部改用局部 `paneEffectiveLayoutTier` 让真 `md + 抽屉关闭` 直接复用 mid 的 `HomeSettingsPane` 代码路径；`HomePage` 维持真实 tier，不再参与该状态的额外高度修补。
2026-03-10: 新增 `shouldUseSegmentedWorkspace` 并收口 `mobile + md drawer open` 到同一 segmented workspace；Guide 宿主拆为“md 固定覆盖 + mobile 覆盖 header 以下整块内容”，同时保持 tabs 视图实现不变。
2026-03-10: 成员清单收口为目录级地图，`sections/` 内部职责下沉到子模块文档，消除父级 L2 对多层子文件的穿透描述。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
