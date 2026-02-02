# src/
> L2 | 父级: /CLAUDE.md

成员清单
App.jsx: 根组件，控制路由与核心布局
main.jsx: Vite 入口文件，初始化 React 根节点
index.css: Tailwind CSS v4 样式入口，集成 shadcn/ui 变量
components/: 原子组件 (ui/) + 业务布局 (layout/) + Landing Sections (landing/)
pages/: 独立页面 (LandingPage, DesignSystem)
lib/: 工具函数 (utils.js 为 shadcn 核心, motion.js 为动画预设)
data/: 业务静态数据 (countries, devices, i18n)


**法则**: 严禁在 component 中直接写十六进制颜色，必须使用 var(--primary) 等 CSS 变量。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
