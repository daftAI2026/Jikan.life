# cards/
> L2 | 父级: /src/pages/registry/sections/workspace/CLAUDE.md

成员清单
index.js: 业务卡聚合入口，导出 `CARD_REGISTRY` 并作为 HomeSettingsPane 的唯一卡片注册源。
CardField.jsx: 通用字段布局壳，提供 `CardFieldsStack/CardField` 统一字段栈与 200px 列宽语义（仅布局，不承载业务分支）。
goal-date-range-field.jsx: Goal 区间日期字段组件，使用 vendored Kumo `DatePicker(mode="range")` + Popover 触发；以 committed/draft 分层承接 `rangeSelectionBehavior="restart"` 与 `onRangeComplete`，并继续用 viewport 驱动 compact/wide 模式切换弹层宽度、对齐与 presets 裁剪。
location-card.jsx: Location 业务卡，实现国家下拉与 `config.country/actions.setCountry` 绑定。
wallpaper-lang-card.jsx: Wallpaper Language 业务卡，实现国旗+语言名渲染与 `config.wallpaperLang/actions.setWallpaperLang` 绑定。
goal-fields-card.jsx: Goal 第③卡，实现 Goal Name / Date Range 两段字段与错误提示（通过 `actions.setGoalRange` 原子写入；effective `mid` 时切为等宽左右并排）。
life-fields-card.jsx: Life 第③卡，实现 DOB / Lifespan 字段与输入约束，DOB 使用官方 Kumo `DatePicker(mode="single")` + Popover 壳。
colors-card.jsx: Colors 业务卡，实现 Background/Accent 双 ColorPicker 与 presets 应用动作；`preset-8` 改为黑色 token 的 `Shuffle` 随机入口（effective `mid` 时 year/goal 隐藏 presets）。
device-card.jsx: Device 业务卡，实现 iPhone 可见机型下拉；本地 `SHOW_DEVICE_RESOLUTION_HINT` 开关控制分辨率注释，默认关闭（Android/iPad 数据保留但默认隐藏）。
url-card.jsx: URL 收口卡，实现 Year 第⑤与 Goal 第⑥的布局分支、Set-it 触发与文案分流；单卡收口语义（effective `mid` 或 `md` bottom-tabs）时复用紧凑锚点行，点击时透传触发元素供关闭后回焦。

架构决策
将 Setting Panel 的“业务语义层”从 HomeSettingsPane 内联对象拆成独立卡文件，保持组件边界清晰：Pane 只负责编排与流程状态，cards 只负责字段渲染与动作绑定。这样可在不改变 UI/UX 的前提下降低单文件复杂度，并为后续单卡增量演进提供稳定落点。

开发规范
所有卡片必须遵循统一入参视图模型（`actions/config/t/...`），仅渲染自身职责字段；跨卡流程状态（如 Set-it 抽屉开关）必须留在 HomeSettingsPane，不得回流到单卡。

变更日志
2026-03-27: `colors-card.jsx` 将 `preset-8` 从静态双色圆点升级为黑色 token 的 `Shuffle` 随机入口：点击后重新随机并立即应用；其余 7 个 presets 继续保持双色圆点与原有交互。
2026-03-01: 新增 `CardField.jsx`，`goal-fields/life-fields/colors` 三卡接入统一字段壳；仅收敛布局重复，不改变业务分支与交互。
2026-02-23: 新建 cards 子模块并落地 location/wallpaper/goal/life/colors/device/url 拆分，保持原有样式类名与交互语义不变。
2026-02-23: Goal 第③卡升级为官方 Kumo DatePicker(range) 路线：新增 `goal-date-range-field`，引入 `Next 30/90 days` presets，并将 Goal 日期写入收口为 `actions.setGoalRange`。
2026-02-24: `device-card` 引入 `VISIBLE_DEVICE_CATEGORIES=["iPhone"]`，将 Android/iPad 从下拉临时隐藏（仅隐藏入口，不删除设备数据）。
2026-02-24: `device-card` 新增 `titleTooltipKey="config.deviceTooltip"`，与 Location 卡一致显示信息提示图标，用于承载 iPhone-only 阶段说明文案。
2026-02-24: `device-card` 改为从 `../device-visibility` 引用 `VISIBLE_DEVICE_CATEGORIES`，将设备可见性策略统一到 workspace 单一真相源，避免卡片层与状态层策略分叉。
2026-02-28: 删除 `settings-card-date-picker-field`；Life 第③卡 DOB 改为官方 Kumo DatePicker(single) + Popover 实现，移除本地日期壳依赖。
2026-03-04: `url-card` 的 Year/Goal/mid 三条 Set-it 按钮点击统一透传 `event.currentTarget` 给 `onSetIt`，配合上层实现 SetupGuide 关闭后焦点回退，保持主流程 UI 不变。
2026-03-06: `device-card` 新增本地开关 `SHOW_DEVICE_RESOLUTION_HINT=false`，默认下线设备分辨率注释显示；保留 Select 分组与 iPhone-only 可见策略，避免把临时决策扩散成全局配置。
2026-03-07: `goal-date-range-field` 移除 `ResizeObserver + requestAnimationFrame + DOM` 测量式收口，改为 `matchMedia` 驱动的 compact/wide 模式；compact 下固定 `276px` 弹层、居中对齐并隐藏 `Next 90 days`，wide 下恢复 `544px` 双月横排，修复首开闪缩与窄开后拉宽不恢复的问题。
2026-03-08: `goal-date-range-field` 将 compact/wide 的 `252px/276px/544px` 硬编码替换为 `--rdp-day-width` 与 `--rdp-months-gap` 推导值，保留响应式行为不变，同时降低对 Kumo 内部尺寸常量变更的维护风险。
2026-03-09: 撤回 `settingsLayoutTier` 抽象；`colors-card`、`goal-fields-card`、`url-card` 恢复直接读取 `effectiveLayoutTier`，由 HomeGrid 在真 `md + 抽屉关闭` 时局部把 pane 送进 mid 路径。
2026-03-09: `url-card` 的 anchored row 语义从纯 `mid` 扩展为“单卡收口模式”：HomeSettingsPane 透传 `useAnchoredSetupRow`，使 `md + drawer open` bottom-tabs 下的第⑥卡也复用左侧输入可缩、右侧按钮右锚且不缩的同一布局策略。
2026-03-10: `goal-date-range-field` 改为 committed/draft 双层状态，打开时用 committed 回填 draft，未完成选择关闭即丢弃；日历接入 vendored DatePicker 的 `rangeSelectionBehavior="restart"` + `onRangeComplete`，实现第二击一次性提交并自动关闭，preset 仍保持直提交流程。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
