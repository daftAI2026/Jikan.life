# src/
> L2 | 父级: /CLAUDE.md

成员清单
App.jsx: 根组件，控制路由与核心布局
main.jsx: Vite 入口文件，初始化 React 根节点
index.css: Tailwind CSS v4 样式入口，集成 Kumo token bridge，并通过 `--step-list-bullet-color` 支持 Setup 面板列表 bullet 局部颜色覆盖
components/: 原子组件 (ui/ Kumo 适配层) + 品牌图标 (icons/)
pages/: 页面模块 (registry/)
lib/: 工具函数 (utils.js 通用工具, motion.js 为动画预设)
data/: 业务静态数据 (countries, devices, i18n)


**法则**: 严禁在 component 中直接写十六进制颜色，必须使用 var(--primary) 等 CSS 变量。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
