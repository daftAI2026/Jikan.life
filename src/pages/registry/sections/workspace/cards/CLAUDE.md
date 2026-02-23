# cards/
> L2 | 父级: /src/pages/registry/sections/workspace/CLAUDE.md

成员清单
index.js: 业务卡聚合入口，导出 `CARD_REGISTRY` 并作为 HomeSettingsPane 的唯一卡片注册源。
settings-card-date-picker-field.jsx: 卡片专用日期字段基础组件，封装 DatePicker + DateInput + Calendar 统一样式与 parseDate 转换。
goal-date-range-field.jsx: Goal 区间日期字段组件，使用官方 Kumo `DatePicker(mode="range")` + Popover 触发，并内置 `Next 30/90 days` presets。
location-card.jsx: Location 业务卡，实现国家下拉与 `config.country/actions.setCountry` 绑定。
wallpaper-lang-card.jsx: Wallpaper Language 业务卡，实现国旗+语言名渲染与 `config.wallpaperLang/actions.setWallpaperLang` 绑定。
goal-fields-card.jsx: Goal 第③卡，实现 Goal Name / Date Range 两段字段与错误提示（通过 `actions.setGoalRange` 原子写入）。
life-fields-card.jsx: Life 第③卡，实现 DOB / Lifespan 字段与输入约束。
colors-card.jsx: Colors 业务卡，实现 Background/Accent 双 ColorPicker 与 presets 应用动作。
device-card.jsx: Device 业务卡，实现 iPhone 可见机型下拉与分辨率提示（Android/iPad 数据保留但默认隐藏）。
url-card.jsx: URL 收口卡，实现 Year 第⑤与 Goal 第⑥的布局分支、Set-it 触发与文案分流。

架构决策
将 Setting Panel 的“业务语义层”从 HomeSettingsPane 内联对象拆成独立卡文件，保持组件边界清晰：Pane 只负责编排与流程状态，cards 只负责字段渲染与动作绑定。这样可在不改变 UI/UX 的前提下降低单文件复杂度，并为后续单卡增量演进提供稳定落点。

开发规范
所有卡片必须遵循统一入参视图模型（`actions/config/t/...`），仅渲染自身职责字段；跨卡流程状态（如 Set-it 抽屉开关）必须留在 HomeSettingsPane，不得回流到单卡。

变更日志
2026-02-23: 新建 cards 子模块并落地 location/wallpaper/goal/life/colors/device/url/date-field 拆分，保持原有样式类名与交互语义不变。
2026-02-23: Goal 第③卡升级为官方 Kumo DatePicker(range) 路线：新增 `goal-date-range-field`，引入 `Next 30/90 days` presets，并将 Goal 日期写入收口为 `actions.setGoalRange`。
2026-02-24: `device-card` 引入 `VISIBLE_DEVICE_CATEGORIES=["iPhone"]`，将 Android/iPad 从下拉临时隐藏（仅隐藏入口，不删除设备数据）。
2026-02-24: `device-card` 新增 `titleTooltipKey="config.deviceTooltip"`，与 Location 卡一致显示信息提示图标，用于承载 iPhone-only 阶段说明文案。
2026-02-24: `device-card` 改为从 `../device-visibility` 引用 `VISIBLE_DEVICE_CATEGORIES`，将设备可见性策略统一到 workspace 单一真相源，避免卡片层与状态层策略分叉。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
