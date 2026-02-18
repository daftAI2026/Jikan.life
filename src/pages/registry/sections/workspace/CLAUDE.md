# workspace/
> L2 | 父级: /src/pages/registry/CLAUDE.md

成员清单
useRegistryWallpaperConfig.js: 工作区状态核心，管理 selectedStyle 联动、配置更新、URL 生成与复制动作（UI 文案跟随全局 i18n）；Goal 模式包含 goalStart 字段、手动输入即时阻断校验与仅合法日期透传
RegistryPreviewPane.jsx: 左侧手机预览面板，使用 Canvas 实时渲染 year/life/goal 壁纸
RegistrySettingsPane.jsx: 右侧属性面板，提供位置/语言/颜色/设备/URL 与类型条件字段；Life DOB 与 Goal 日期字段直连 react-aria DatePicker（同 main 组件栈），Goal 区按 Goal Name/Start Date/Target Date 三列排列（移动端单列）并展示字段级日期错误

结构
workspace/ - Registry 双栏工作区子模块 (3 files)

架构决策
采用“状态 hook + 左右面板”分层，HomeGrid 只负责编排，避免把业务状态和 UI 布局耦合在一个超大组件里。

开发规范
只使用 Kumo token 与 `@/components/ui/*` 组件语义；任何配置字段新增必须同步更新 hook 输出和右侧表单映射，并同步 URL 参数链路。

变更日志
2026-02-11: 新增 preview|settings 双栏工作区，实现与左侧 style cards 的直接联动。
2026-02-11: 移除固定英文翻译器，改为使用 useI18n 提供的全局 t()。
2026-02-11: Wallpaper Language 下拉改为与顶部语言菜单一致的“国旗 + 原名”渲染语义与间距。
2026-02-13: Goal 配置新增 Start Date(goalStart)；桌面三列 1:1:1，移动端单列；手动输入与 picker 同步约束（1900~2100, start<=target）。
2026-02-14: Registry 日期输入从原生 type="date" 切换为 main 同源 react-aria DatePicker 接口接入（DOB/Goal Start/Goal Target）；本阶段仅完成功能替换，UI 精修后置。
2026-02-18: RegistrySettingsPane 通过 `@/components/ui/kumo` 引用 Button/Input/Select，移除页面层对 `@cloudflare/kumo` 的直接依赖。
2026-02-18: Goal 日期硬约束统一为 `start<=target`；允许未来 Start Date 与过去 Target Date；前后端统一使用 1900-2100 范围校验。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
