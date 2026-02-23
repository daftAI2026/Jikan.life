# sections/
> L2 | 父级: /src/pages/registry/CLAUDE.md

成员清单
HomeTopbar.jsx: 顶栏区域（桌面），支持 hideLanguage（侧栏收起时隐藏左侧语言切换），右侧展示 GitHub 与小红书社交入口
HomeSidebar.jsx: 本地侧栏，负责样式卡片选择与侧栏开合交互（支持 sidebarOpen/onSidebarOpenChange 受控接口，文案走 i18n）；Year 预览使用 10x10 点阵并与底部百分比同源映射（0% 仍保留第一个 today 点）；本地午夜自动刷新 yearStats；GoalVisual 圆环粗细 strokeWidth=2.5
ThemeToggle.jsx: Home 本地主题切换按钮（light/dark），写入 data-mode 与 localStorage
LanguageSelect.jsx: Home UI 语言切换组件（触发器为“线框地球图标+语言名”，菜单为“国旗+语言名”且保留默认选中勾，二者间距统一；桌面顶栏左侧挂载，移动端保留右下角入口）
SearchDialog.jsx: Home 搜索入口占位组件（兼容 open/onOpenChange 接口）
JikanMenuIcon.jsx: Home 本地菜单动效图标（避免跨包引用 vendor docs 源码）
RegistryHeader.jsx: 旧版顶栏（保留备用）
RegistryOverview.jsx: 旧版概览区（保留备用）
RegistryBlocks.jsx: 旧版 Blocks 区（保留备用）
RegistrySection.jsx: 旧版区块包装器

架构决策
sections 页面层统一通过 `@/components/ui/*` 引用 Kumo 组件；`cn` 工具统一来自 `@/lib/utils`。
第一阶段命名收口仅覆盖在用链路（HomeTopbar/HomeSidebar），备用旧文件保持原名，避免一次性扩大改动面。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
