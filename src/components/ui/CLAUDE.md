# components/ui/
> L2 | 父级: /src/CLAUDE.md

成员清单
button.jsx: 按钮组件，Kumo Button 适配层，保留现有 API
card.jsx: 卡片组件，Kumo Surface 适配层，支持 elevated/inset/flat
input.jsx: 输入框组件，Kumo Input 适配层
badge.jsx: 徽章组件，Kumo Badge 适配层
label.jsx: 标签组件，无状态
dialog.jsx: 对话框组件，Kumo Dialog 适配层
sheet.jsx: 抽屉组件，Radix 原生 (待迁移)
select.jsx: 下拉选择器，Kumo Select 适配层
checkbox.jsx: 复选框
radio-group.jsx: 单选组
switch.jsx: 开关切换，Kumo Switch 适配层
textarea.jsx: 多行输入
form.jsx: 表单容器
alert.jsx: 警告提示
sonner.jsx: Toast 通知
skeleton.jsx: 骨架屏
progress.jsx: 进度条
tabs.jsx: 标签页，Kumo Tabs 适配层
accordion.jsx: 手风琴折叠
dropdown-menu.jsx: 下拉菜单
navigation-menu.jsx: 导航菜单
avatar.jsx: 头像
table.jsx: 表格
popover.jsx: 气泡弹出，直接 re-export Kumo Popover 原语（避免自写 overlay 链）
tooltip.jsx: 工具提示，Kumo Tooltip 适配层
hover-card.jsx: 悬停卡片
scroll-area.jsx: 滚动区域
separator.jsx: 分割线
command.jsx: 命令面板
collapsible.jsx: 可折叠区域
slider.jsx: 滑块
calendar.jsx: 日历组件，基于 react-aria-components，支持单选/范围/月份年份选择，直接使用 Kumo 语义 token（无 CVA 依赖）
date-picker.jsx: 日期选择器，JollyUI 风格，支持键盘输入 + 日历弹出，弹窗背景使用 bg-kumo-control 对齐 Kumo Select
datefield.jsx: 日期/时间输入字段，支持键盘输入和格式化
color.jsx: 颜色原语组件，基于 react-aria-components，导出 ColorWheel/ColorArea/ColorSwatch 等，ColorThumb 采用外圈+中心点分层常量，作为颜色面板视觉样式单一来源
color-picker.jsx: 颜色选择器，采用 Kumo Popover.Trigger/Content + Kumo Select，色域 `aspect-square` + 工具栏 `1:2+弹性输入` 布局，通道输入使用配置映射并维持对外 hex 协议
use-color-picker-state-bridge.js: ColorPicker 状态桥 hook，负责外部受控 hex 与内部 Color 对象同步保护
field.jsx: 表单字段容器，react-aria-components 基础组件
kumo.jsx: Registry 页面层统一 Kumo 组件导出入口，收敛 pages 对上游包的直接引用（含 `DatePicker` 对外导出）

**设计语言**: Kumo UI (Base UI) + Kumo Token Bridge
- 颜色: 禁止硬编码，仅使用 Kumo token 或语义变量 (var(--color-kumo-*) / var(--primary))
- 阴影: 使用 Kumo Surface + Tailwind shadow，禁止 --neumorphic-*
- 图标: 统一 @phosphor-icons/react
- 动画: 交互使用 lib/motion.js 的 Spring 预设

变更日志
2026-02-12: ColorPicker 弹层链路回归主线同构（Kumo Popover + Kumo Select），移除跨体系弹层混搭。
2026-02-12: ColorArea/SliderTrack 禁止 `overflow-hidden` 裁切 Thumb，确保颜色手柄完整可见。
2026-02-12: ColorPicker 增加 `useColorPickerStateBridge`，修复触底时 `hex` 回流导致 hue/brightness 通道重置和双拇指跳左锁死。
2026-02-12: 将 `useColorPickerStateBridge` 抽离到 `use-color-picker-state-bridge.js`，ColorPicker 只保留渲染与交互编排职责。
2026-02-13: ColorPicker 完成 KUMO 视觉同化，输入/选择器统一 token，色域改为 `aspect-square`，工具栏调整为 `吸管:颜色空间=1:2` + 剩余输入框。
2026-02-13: ColorPicker 通道输入改为 `COLOR_SPACE_CHANNELS` 配置驱动，减少 `rgb/hsl/hsb` 重复分支。
2026-02-13: ColorThumb 样式拆为 `BASE/OUTER_RING/CENTER_DOT/FOCUS` 常量，采用分层渲染以降低边缘混色风险。
2026-02-15: DatePicker 弹窗背景从 `bg-popover` (#FAFAFA) 对齐到 `bg-kumo-control` (#FFFFFF)，匹配 Kumo Select 弹窗一致性。
2026-02-16: Calendar 完全移除 CVA(`buttonVariants`) 依赖，箭头按钮和日期格子直接使用 Kumo 语义 token。选中态改为 `bg-foreground text-background`（黑白反色），hover 对齐 `hover:bg-kumo-tint`（KumoButton ghost 标准）。
2026-02-18: 新增 `kumo.jsx` 聚合导出层，约束 Registry 页面层仅通过 `@/components/ui/*` 引用 Kumo 组件。
2026-02-23: `kumo.jsx` 新增 `DatePicker` 导出，供 workspace Goal 第③卡接入官方 Kumo DatePicker(range) 本体。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
