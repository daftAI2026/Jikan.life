# public/
> L2 | 父级: /CLAUDE.md

成员清单
favicon.svg: 站点图标资源
favicon-square-legacy.svg: 旧版站点图标备份，保留方形外框版本以便回退
api/: 静态 API 资源目录，承载 SearchDialog 所需的 component registry 响应（详见 api/CLAUDE.md）
preview/: 网页 preview 专用静态锁屏壳资源目录（详见 preview/CLAUDE.md）
robots.txt: 搜索引擎爬虫指引，允许全部抓取并指向 Sitemap
sitemap.xml: 站点地图，保持单 URL 抓取策略，仅公开首页 `/`

结构
public/ - Vite 静态资源根目录 (favicon + 静态 API 响应 + preview 壳层资源)

架构决策
在无 Astro API 路由的 Vite 环境下，使用 `public/api/component-registry` 提供 SearchDialog 所需数据，保证 npm 包 `@cloudflare/kumo` 的 SearchDialog 能直接运行。
Sitemap 保持单 URL 策略：在不新增公开页面的约束下，只公开首页 `/`，并仅依赖首页最小离屏 SEO 语义补强抓取基础信号，不新增 FAQ/说明页语义。

开发规范
public 目录仅放静态可直接托管文件，不写业务逻辑代码。

变更日志
2026-03-26: `sitemap.xml` 继续保持仅公开首页 `/` 的单 URL 策略，并刷新 `lastmod` 以配合首页最小离屏 SEO 语义上线。
2026-03-21: favicon 改为圆形描边版本，并将旧方形版本重命名为 `favicon-square-legacy.svg` 保留回退入口。
2026-03-10: 新增 `preview/` 静态资源目录，承载网页 preview 固定 Figma 锁屏壳的 SVG 分层资源。
2026-02-11: 新增 api/component-registry 静态接口文件，支撑 Kumo SearchDialog 搜索能力。
2026-02-12: 将 GitHub 小图标资源迁移至 `src/components/icons/`，避免无业务关联的品牌资产散落在 public 根目录。
2026-03-10: 成员清单收口为目录级映射，`api/` 子树职责下沉到 `public/api/CLAUDE.md`，避免父级文档穿透描述子模块文件。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
