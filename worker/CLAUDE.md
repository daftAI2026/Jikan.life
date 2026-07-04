# worker/
> L2 | 父级: /CLAUDE.md

成员清单
index.js: Worker 入口，在全请求 `run_worker_first` 下优先拦截内部文档/API 静态直出、处理首页 `/`、历史入口 `/app`/`/app/` 的 308 永久重定向，再做 `/generate`、`/og-image.png` 与健康检查路由；`/generate` 仅允许 GET/OPTIONS，缓存键使用 ASCII-safe SHA-256 目标 URL 并纳入 `fg` 与 `goalName` 哈希，负责 WASM 初始化、字体 buffer 装载与共享 OG/壁纸 PNG 渲染。
svg.js: SVG 生成核心逻辑，统一复用 shared 字体策略并做 XML 属性安全转义，预声明 Inter + Noto Sans JP/SC/TC 字体栈，复导出 resolveContrastBase。
validation.js: Zod 请求参数校验（含 fg=light|dark 前景色覆盖、goalStart 可选字段、1900-2100 年份边界与 goalStart <= goal 硬约束）
timezone.js: 时区处理工具（导出 `getTimezone/normalizeTimezone/getDateInTimezone`，并委托 shared/date-math 的时区日期归一真相源）
generators/: 各类网格生成器 (year, life, goal, og)

变更日志
2026-07-04: Worker 路由边界收紧为全请求先过 Worker；`/generate` 增加非 GET 405 + Allow 头，缓存键补入前景色维度并对 Unicode goalName 做 hash，避免 header 非 ASCII 与缓存串味。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
