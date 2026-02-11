# pages/registry/
> L2 | 父级: /src/pages/CLAUDE.md

成员清单
RegistryHome.jsx: Registry 根页面，维护 selectedStyle 单一状态并编排双栏工作区
registry-data.js: Registry 旧版导航与示例数据（备用）
sections/RegistryTopbar.jsx: 顶栏区域，左侧挂载 UI 语言切换，右侧展示 GitHub 与小红书社交入口
sections/RegistrySidebar.jsx: 本地受控侧栏，保留 Kumo 动效并向工作区分发 style 选择
sections/ThemeToggle.jsx: vendor Kumo ThemeToggle 的薄包装（同源挂载）
sections/LanguageSelect.jsx: Registry UI 语言切换组件（触发器为线框地球图标+语言名；菜单为国旗+语言名并保留默认选中勾；桌面挂载于顶栏左侧，移动端保留右下角入口）
sections/SearchDialog.jsx: vendor Kumo SearchDialog 的薄包装（同源挂载）
sections/KumoMenuIcon.jsx: vendor Kumo KumoMenuIcon 的薄包装（同源挂载）
sections/CLAUDE.md: sections 子模块文档
sections/components/HomeGrid.jsx: preview|settings 双栏工作区编排层
sections/workspace/useRegistryWallpaperConfig.js: 双栏工作区状态核心与 URL 生成逻辑
sections/workspace/RegistryPreviewPane.jsx: 左侧手机预览画布
sections/workspace/RegistrySettingsPane.jsx: 右侧属性设置表单
sections/workspace/CLAUDE.md: 双栏工作区子模块文档
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
ThemeToggle/SearchDialog/KumoMenuIcon 继续同源薄包装；Sidebar 与 HomeGrid 改为本地受控实现，在不改 vendor 的前提下承载业务联动与双栏工作区。

开发规范
只使用 @cloudflare/kumo 组件与 Kumo token，禁止引入其他设计系统组件。

变更日志
2026-02-10: 新增 Kumo 首页复刻组件与布局模块。
2026-02-11: 改为 vendor/kumo 同源挂载，移除手写实现偏差。
2026-02-11: 首页改造为 preview|settings 双栏，新增 workspace 子模块并实现 style cards 联动。
2026-02-11: 新增 LanguageSelect 入口并将 Registry UI 文案切换为 useI18n 驱动；语言控件迁移到顶栏左侧，触发器改为“线框地球图标+语言名”，菜单保持“国旗+语言名”并保留默认选中勾。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
