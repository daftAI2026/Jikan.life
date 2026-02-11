# pages/registry/
> L2 | 父级: /src/pages/CLAUDE.md

成员清单
RegistryHome.jsx: Registry 根页面，复刻 Kumo 首页布局
registry-data.js: Registry 旧版导航与示例数据（备用）
sections/RegistryTopbar.jsx: 顶栏区域，展示 @cloudflare/kumo 与版本徽标
sections/RegistrySidebar.jsx: vendor Kumo SidebarNav 的薄包装（同源挂载）
sections/ThemeToggle.jsx: vendor Kumo ThemeToggle 的薄包装（同源挂载）
sections/SearchDialog.jsx: vendor Kumo SearchDialog 的薄包装（同源挂载）
sections/KumoMenuIcon.jsx: vendor Kumo KumoMenuIcon 的薄包装（同源挂载）
sections/components/HomeGrid.jsx: vendor Kumo HomeGrid 的薄包装（同源挂载）
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
以 Kumo 源码为单一真值，`RegistrySidebar/HomeGrid/ThemeToggle/SearchDialog/KumoMenuIcon` 全部改为同源薄包装；旧版区块保留但不再引用。

开发规范
只使用 @cloudflare/kumo 组件与 Kumo token，禁止引入其他设计系统组件。

变更日志
2026-02-10: 新增 Kumo 首页复刻组件与布局模块。
2026-02-11: 改为 vendor/kumo 同源挂载，移除手写实现偏差。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
