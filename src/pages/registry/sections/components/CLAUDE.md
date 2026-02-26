# components/
> L2 | 父级: /src/pages/registry/CLAUDE.md

成员清单
HomeGrid.jsx: Registry 主工作区编排层，承载 preview|settings 双栏与 selectedStyle 联动，并上提 Set-it 流程状态（copy success 后平台分流）与 md 整区 Guide 宿主；Guide 打开时接入页面级阻断锁
ComponentCell.jsx: 网格单元壳，负责标题与内容排布
ComponentGrid.jsx: 旧版组件墙网格（备用）
ComponentData.js: 旧版网格条目数据（备用）

结构
components/ - 组件墙子模块 (4 files)

架构决策
HomeGrid 从 vendor 薄包装切换为本地编排实现；旧网格模块继续保留备用，不参与当前页面渲染。

开发规范
只使用 `@/components/ui/*` 统一入口组件与 Kumo token，禁止引入 shadcn 子组件或自定义颜色。

变更日志
2026-02-10: 新增 HomeGrid 复刻 Kumo 首页组件墙。
2026-02-11: HomeGrid 改为 vendor/kumo 薄包装挂载。
2026-02-11: HomeGrid 改为本地双栏工作区编排，接入 workspace 子模块。
2026-02-18: ComponentCell/ComponentGrid 改为通过 `@/components/ui/kumo` 引用 Kumo 组件，移除页面层直引上游包。
2026-02-25: HomeGrid 上提 Setup flow 状态（`isSetupPanelOpen/setupPlatform`）并新增 `md` 专用整区 Guide 宿主（`hidden md:block lg:hidden` + `h-[calc(100dvh-48px)]`），保持中档覆盖范围与 viewport 同步。
2026-02-26: HomeGrid 接入 `useRegistryBlockingScrollLock`，SetupGuide 打开时统一锁背景滚动；md 宿主继续固定覆盖，但容器显式收敛为 `overflow-hidden overscroll-none`，避免外层参与滚动链。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
