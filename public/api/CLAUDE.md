# api/
> L2 | 父级: /public/CLAUDE.md

成员清单
component-registry: Kumo SearchDialog 拉取的静态组件注册表 JSON 响应体

结构
api/ - 静态 API 路径映射目录 (由 Vite public 直接托管)

架构决策
用静态文件替代 Astro 的 `/api/component-registry` 动态端点，满足 npm 包 `@cloudflare/kumo` SearchDialog 的运行前提。

开发规范
文件名即 URL 路径，修改数据结构时必须保持与 SearchDialog 预期字段一致。

变更日志
2026-02-11: 新增 component-registry 静态接口文件。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
