# workspace/
> L2 | 父级: /src/pages/registry/CLAUDE.md

成员清单
useRegistryWallpaperConfig.js: 工作区状态核心，管理 selectedStyle 联动、配置更新、URL 生成与复制动作，并固定 Registry 页英文文案
RegistryPreviewPane.jsx: 左侧手机预览面板，使用 Canvas 实时渲染 year/life/goal 壁纸
RegistrySettingsPane.jsx: 右侧属性面板，提供位置/语言/颜色/设备/URL 与类型条件字段

结构
workspace/ - Registry 双栏工作区子模块 (3 files)

架构决策
采用“状态 hook + 左右面板”分层，HomeGrid 只负责编排，避免把业务状态和 UI 布局耦合在一个超大组件里。

开发规范
只使用 Kumo token 与 Kumo 组件语义；任何配置字段新增必须同步更新 hook 输出和右侧表单映射。

变更日志
2026-02-11: 新增 preview|settings 双栏工作区，实现与左侧 style cards 的直接联动。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
