# pages/registry/
> L2 | 父级: /src/pages/CLAUDE.md

成员清单
HomePage.jsx: Home 根页面，维护 selectedStyle + sidebarOpen 状态，并在侧栏收起时控制顶栏语言按钮隐藏
registry-data.js: Registry 旧版导航与示例数据（备用）
sections/HomeTopbar.jsx: 顶栏区域，支持 hideLanguage（侧栏收起时隐藏左侧语言切换），右侧展示 GitHub 与小红书社交入口
sections/HomeSidebar.jsx: 本地侧栏，支持 sidebarOpen/onSidebarOpenChange 受控开合，保留 Kumo 动效并向工作区分发 style 选择
sections/ThemeToggle.jsx: Home 本地主题切换按钮（light/dark），写入 data-mode 与 localStorage
sections/LanguageSelect.jsx: Home UI 语言切换组件（触发器为线框地球图标+语言名；菜单为国旗+语言名并保留默认选中勾；桌面挂载于顶栏左侧，移动端保留右下角入口）
sections/SearchDialog.jsx: Home 搜索入口占位组件（兼容 open/onOpenChange 接口）
sections/JikanMenuIcon.jsx: Home 本地菜单动效图标（避免跨包引用 vendor docs 源码）
sections/CLAUDE.md: sections 子模块文档
sections/components/HomeGrid.jsx: preview|settings 双栏工作区编排层
sections/workspace/useHomeWallpaperConfig.js: 双栏工作区状态核心与 URL 生成逻辑
sections/workspace/HomePreviewPane.jsx: 左侧手机预览画布
sections/workspace/HomeSettingsPane.jsx: 右侧六卡设置面板编排层（负责卡序与 Set-it 门控），业务卡实现下沉到 cards 子模块
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
sections/RegistrySection.jsx: 旧版区块包装器

结构
registry/ - Kumo UI 单页模块 (sections + registry-data.js)

架构决策
ThemeToggle/SearchDialog/JikanMenuIcon 全部改为本地实现；Sidebar 与 HomeGrid 维持本地受控实现，彻底切断对 vendor docs 源码的构建期耦合。
页面层统一通过 `@/components/ui/*` 引用 Kumo 组件；禁止 `src/pages/registry/**` 直接 import `@cloudflare/kumo`。

开发规范
只使用 `@/components/ui/*` 统一入口组件与 Kumo token，禁止引入其他设计系统组件。

变更日志
2026-02-10: 新增 Kumo 首页复刻组件与布局模块。
2026-02-11: 改为 vendor/kumo 同源挂载，移除手写实现偏差。
2026-02-11: 首页改造为 preview|settings 双栏，新增 workspace 子模块并实现 style cards 联动。
2026-02-11: 新增 LanguageSelect 入口并将 Registry UI 文案切换为 useI18n 驱动；语言控件迁移到顶栏左侧，触发器改为“线框地球图标+语言名”，菜单保持“国旗+语言名”并保留默认选中勾。
2026-02-12: 移除 Registry 对 vendor/kumo-docs-astro 组件源码的直接引用，修复 CI 构建被 Astro tsconfig 依赖阻塞的问题。
2026-02-18: 页面层组件引用统一收敛到 `@/components/ui/*`，移除 `src/pages/registry/**` 的 `@cloudflare/kumo` 直引。
2026-02-18: 第一阶段入口收口：下线 Landing，`/app` 改为重定向 `/`，核心在用文件改名为 Home*（目录保持 registry）。
2026-02-23: workspace 设置面板完成“编排层/业务卡层”拆分，新增 `sections/workspace/cards/*` 子模块并保持现有 UI/UX 与行为不变。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
