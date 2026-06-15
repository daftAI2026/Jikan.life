# components/ui/
> L2 | 父级: /src/components/CLAUDE.md

成员清单
input.jsx: 输入框组件，Kumo Input 适配层
badge.jsx: 徽章组件，Kumo Badge 适配层
select.jsx: 下拉选择器，Kumo Select 适配层
switch.jsx: 开关切换，Kumo Switch 适配层
popover.jsx: 气泡弹出，直接 re-export Kumo Popover 原语（避免自写 overlay 链）
tooltip.jsx: 工具提示，Kumo Tooltip 适配层
color.jsx: 颜色原语组件，基于 react-aria-components，导出 ColorWheel/ColorArea/ColorSwatch 等，ColorThumb 采用外圈+中心点分层常量，作为颜色面板视觉样式单一来源
color-picker.jsx: 颜色选择器，采用 Kumo Popover.Trigger/Content + Kumo Select，色域 `aspect-square` + 工具栏 `36px + 2fr + 2fr` 布局，通道输入使用配置映射和统一数字 typography，并在触发按钮内用即时 tooltip 暴露 HEX
use-color-picker-state-bridge.js: ColorPicker 状态桥 hook，负责外部受控 hex 与内部 Color 对象同步保护
kumo.jsx: Registry 页面层统一 Kumo 组件导出入口，收敛 pages 对上游包的直接引用（含 `DatePicker` / `ClipboardText` / `SkeletonLine` / `Tabs` 对外导出）
vendor/: 临时 vendored 上游运行时快照区，仅用于 npm 未发版前桥接最小闭包（当前承载 Goal range restartable DatePicker）

**设计语言**: Kumo UI (Base UI) + Kumo 原生 Token
- 颜色: 禁止硬编码，仅使用 Kumo 原生变量 (var(--color-kumo-*) / var(--text-color-kumo-*))
- 阴影: 使用 Kumo LayerCard + Tailwind shadow，禁止 --neumorphic-*
- 图标: 统一 @phosphor-icons/react
- 动画: 交互使用 lib/motion.js 的 Spring 预设

变更日志
2026-02-12: ColorPicker 弹层链路回归主线同构（Kumo Popover + Kumo Select），移除跨体系弹层混搭。
2026-02-12: ColorArea/SliderTrack 禁止 `overflow-hidden` 裁切 Thumb，确保颜色手柄完整可见。
2026-02-12: ColorPicker 增加 `useColorPickerStateBridge`，修复触底时 `hex` 回流导致 hue/brightness 通道重置和双拇指跳左锁死。
2026-02-12: 将 `useColorPickerStateBridge` 抽离到 `use-color-picker-state-bridge.js`，ColorPicker 只保留渲染与交互编排职责。
2026-02-13: ColorPicker 完成 KUMO 视觉同化，输入/选择器统一 token，色域改为 `aspect-square`，工具栏调整为 `吸管:颜色空间=1:2` + 剩余输入框。
2026-02-13: ColorPicker 通道输入改为 `COLOR_SPACE_CHANNELS` 配置驱动，减少 `rgb/hsl/hsb` 重复分支。
2026-06-15: ColorPicker 工具栏从 `吸管:颜色空间=1:2 + 弹性输入` 调整为 `36px + 2fr + 2fr`，吸管保持 36×36，颜色空间与 HEX 输入平分剩余宽度。
2026-06-16: ColorPicker 触发按钮新增即时 HEX hover/aria 提示并移除原生 `title` 慢路径；通道输入改用 `text-sm font-medium tabular-nums`，让 RGB/HSL/HSB 的数值、角度与百分比保持同一视觉重量。
2026-02-13: ColorThumb 样式拆为 `BASE/OUTER_RING/CENTER_DOT/FOCUS` 常量，采用分层渲染以降低边缘混色风险。
2026-02-18: 新增 `kumo.jsx` 聚合导出层，约束 Registry 页面层仅通过 `@/components/ui/*` 引用 Kumo 组件。
2026-02-23: `kumo.jsx` 新增 `DatePicker` 导出，供 workspace Goal 第③卡接入官方 Kumo DatePicker(range) 本体。
2026-02-24: `kumo.jsx` 新增 `ClipboardText` 导出，供 workspace SetupGuidePanel 的 iOS 第3步渲染长 URL 复制控件。
2026-02-26: `kumo.jsx` 新增 `SkeletonLine` 导出，供 workspace 空态骨架与 AutoFlow 未解锁卡占位统一复用官方组件。
2026-02-28: 下线 `/design` 链路并删除 19 个不可达 shadcn/Radix 预置组件，保留活跃 Kumo 适配层；页面层继续优先走 `kumo.jsx` 聚合入口。
2026-02-28: Life 第③卡 DOB 切换为官方 `kumo` DatePicker(single) 壳实现，删除本地 `calendar/date-picker/datefield` 日期壳链路。
2026-02-28: 删除零引用的本地 `dropdown-menu.jsx`，清理非活跃链路旧语义 token 残留。
2026-03-01: 删除零调用方的 `card.jsx`/`field.jsx`/`label.jsx`/`separator.jsx`，卸载 `@radix-ui/react-label` 和 `@radix-ui/react-separator`。
2026-03-01: ColorPicker 切换为直接使用 Kumo Button，删除本地 `button.jsx` 适配层，卸载 `@radix-ui/react-slot` 和 `class-variance-authority`。
2026-03-09: `kumo.jsx` 新增 `Tabs` 导出，供 workspace 在 `md + drawer open` 下接入官方 segmented tabs 底栏。
2026-03-10: 新增 `vendor/kumo-date-picker/` snapshot，固定上游 commit `72433e38914eee652c65506c6165582450f0a1d7` 的最小 DatePicker dist 闭包；`kumo.jsx` 的 `DatePicker` 改走本地 vendor 桥接 `rangeSelectionBehavior/onRangeComplete`，其余组件继续来自 npm `@cloudflare/kumo`。
2026-05-05: npm `@cloudflare/kumo` 升级到 2.0.2；上游 DatePicker 仍未包含 `rangeSelectionBehavior/onRangeComplete`，继续保留本地 vendor 桥接层。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
