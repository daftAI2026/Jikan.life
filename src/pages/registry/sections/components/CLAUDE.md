# components/
> L2 | 父级: /src/pages/registry/CLAUDE.md

成员清单
HomeGrid.jsx: vendor Kumo HomeGrid 的薄包装，同源挂载并锁定默认态
ComponentCell.jsx: 网格单元壳，负责标题与内容排布
ComponentGrid.jsx: 旧版组件墙网格（备用）
ComponentData.js: 旧版网格条目数据（备用）

结构
components/ - 组件墙子模块 (4 files)

架构决策
采用 HomeGrid 同源挂载策略，避免手写复制产生视觉和交互漂移；旧网格模块保留备用。

开发规范
只使用 @cloudflare/kumo 组件与 Kumo token，禁止引入 shadcn 子组件或自定义颜色。

变更日志
2026-02-10: 新增 HomeGrid 复刻 Kumo 首页组件墙。
2026-02-11: HomeGrid 改为 vendor/kumo 薄包装挂载。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
