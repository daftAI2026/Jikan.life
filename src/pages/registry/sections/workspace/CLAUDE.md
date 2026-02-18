# workspace/
> L2 | 父级: /src/pages/registry/CLAUDE.md

成员清单
useHomeWallpaperConfig.js: 工作区状态核心，管理 selectedStyle 联动、配置更新、URL 生成与复制动作（UI 文案跟随全局 i18n）；Goal 模式包含 goalStart 字段、手动输入即时阻断校验与仅合法日期透传
HomePreviewPane.jsx: 左侧手机预览面板，使用 Canvas 实时渲染 year/life/goal 壁纸
HomeSettingsPane.jsx: 右侧设置面板主容器；当前阶段输出 schema 驱动的六卡 demo 骨架（Button/Input/Switch/Input Validation/Dropdown/Collapsible），导出 `SETTINGS_CARD_IDS`，并在开发态通过 `legacySettings=1` 条件挂载 LegacySettingsForm
SettingsCardShell.jsx: 右侧六卡统一壳组件，复刻 Kumo HomeGrid 单卡结构（左上标题 + 右上序号 ①~⑥ + 中央 demo）并提供 `data-home-settings-card` 稳定选择器

结构
workspace/ - Home 双栏工作区子模块 (4 files)

架构决策
采用“状态 hook + 左右面板”分层，HomeGrid 只负责编排；右侧设置区采用“schema + render 函数 + 壳组件”模式，把视觉骨架与字段逻辑解耦，后续逐卡迁移只替换单卡 render 内容。

开发规范
只使用 Kumo token 与 `@/components/ui/*` 组件语义；任何配置字段新增必须同步更新 hook 输出和右侧表单映射，并同步 URL 参数链路。

变更日志
2026-02-11: 新增 preview|settings 双栏工作区，实现与左侧 style cards 的直接联动。
2026-02-11: 移除固定英文翻译器，改为使用 useI18n 提供的全局 t()。
2026-02-11: Wallpaper Language 下拉改为与顶部语言菜单一致的“国旗 + 原名”渲染语义与间距。
2026-02-13: Goal 配置新增 Start Date(goalStart)；桌面三列 1:1:1，移动端单列；手动输入与 picker 同步约束（1900~2100, start<=target）。
2026-02-14: Registry 日期输入从原生 type="date" 切换为 main 同源 react-aria DatePicker 接口接入（DOB/Goal Start/Goal Target）；本阶段仅完成功能替换，UI 精修后置。
2026-02-18: HomeSettingsPane 通过 `@/components/ui/kumo` 引用 Button/Input/Select，移除页面层对 `@cloudflare/kumo` 的直接依赖。
2026-02-18: Goal 日期硬约束统一为 `start<=target`；允许未来 Start Date 与过去 Target Date；前后端统一使用 1900-2100 范围校验。
2026-02-18: 第一阶段命名收口：`useHomeWallpaperConfig` / `HomePreviewPane` / `HomeSettingsPane` 取代 Registry* 在用导出名。
2026-02-18: 第二阶段右侧改造：引入 SettingsCardShell + 六卡 schema demo 骨架（复刻 Kumo HomeGrid 风格）；旧完整表单改为开发态 `legacySettings=1` 才挂载。
2026-02-18: 六卡右上角增加固定序号标记（①~⑥），用于步骤语义与视觉定位。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
