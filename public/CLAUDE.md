# public/
> L2 | 父级: /CLAUDE.md

成员清单
favicon.svg: 站点图标资源
api/component-registry: Kumo SearchDialog 使用的静态组件注册表接口
api/CLAUDE.md: public/api 子模块说明文档

结构
public/ - Vite 静态资源根目录 (favicon + 静态 API 响应)

架构决策
在无 Astro API 路由的 Vite 环境下，使用 `public/api/component-registry` 提供 SearchDialog 所需数据，保证 vendor 组件可直接运行。

开发规范
public 目录仅放静态可直接托管文件，不写业务逻辑代码。

变更日志
2026-02-11: 新增 api/component-registry 静态接口文件，支撑 Kumo 同源挂载搜索能力。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
