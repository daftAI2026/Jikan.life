# worker/
> L2 | 父级: /CLAUDE.md

成员清单
index.js: Worker 入口，优先处理历史入口 `/app`/`/app/` 的 308 永久重定向，再做 API 路由与 WASM 初始化，解析 fg 参数为 foregroundOverride，并按 goalName 脚本额外补载 CJK 字体 buffer。
svg.js: SVG 生成核心逻辑，统一复用 shared 字体策略并做 XML 属性安全转义，预声明 Inter + Noto Sans JP/SC/TC 字体栈，复导出 resolveContrastBase。
validation.js: Zod 请求参数校验（含 fg=light|dark 前景色覆盖、goalStart 可选字段、1900-2100 年份边界与 goalStart <= goal 硬约束）
timezone.js: 时区处理工具（导出 `getTimezone/normalizeTimezone/getDateInTimezone`，并委托 shared/date-math 的时区日期归一真相源）
generators/: 各类网格生成器 (year, life, goal)

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
