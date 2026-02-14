# worker/
> L2 | 父级: /CLAUDE.md

成员清单
index.js: Worker 入口，处理路由与 WASM 初始化
svg.js: SVG 生成核心逻辑
validation.js: Zod 请求参数校验（含 goalStart 可选字段、1900-2100 年份边界与 goalStart <= goal 硬约束）
timezone.js: 时区处理工具
i18n.js: 服务端国际化字符串
generators/: 各类网格生成器 (year, life, goal)

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
