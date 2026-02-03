# components/ui/
> L2 | 父级: /src/CLAUDE.md

成员清单
button.jsx: 按钮组件，支持 8 个变体 + 6 种尺寸，微拟物渐变+立体阴影
card.jsx: 卡片组件，支持 elevated/inset/flat 三变体，动态阴影
input.jsx: 输入框组件，内凹阴影效果，focus 状态增强
badge.jsx: 徽章组件，支持 5 个变体含 gradient，渐变背景
label.jsx: 标签组件，无状态
dialog.jsx: 对话框组件，Radix 原生
sheet.jsx: 抽屉组件，Radix 原生
select.jsx: 下拉选择器，支持非 portal 渲染与自动聚焦控制
checkbox.jsx: 复选框
radio-group.jsx: 单选组
switch.jsx: 开关切换
textarea.jsx: 多行输入
form.jsx: 表单容器
alert.jsx: 警告提示
sonner.jsx: Toast 通知
skeleton.jsx: 骨架屏
progress.jsx: 进度条
tabs.jsx: 标签页
accordion.jsx: 手风琴折叠
dropdown-menu.jsx: 下拉菜单
navigation-menu.jsx: 导航菜单
avatar.jsx: 头像
table.jsx: 表格
popover.jsx: 气泡弹出，基于 react-aria-components，导出 Popover/PopoverTrigger/PopoverDialog
tooltip.jsx: 工具提示
hover-card.jsx: 悬停卡片
scroll-area.jsx: 滚动区域
separator.jsx: 分割线
command.jsx: 命令面板
collapsible.jsx: 可折叠区域
slider.jsx: 滑块
calendar.jsx: 日历组件，基于 react-aria-components，支持单选/范围/月份年份选择，年份范围可配置
date-picker.jsx: 日期选择器，JollyUI 风格，支持键盘输入 + 日历弹出
datefield.jsx: 日期/时间输入字段，支持键盘输入和格式化
color-picker.jsx: JollyUI(react-aria) 颜色选择器，支持 HSBA/RGBA + EyeDropper 吸管
field.jsx: 表单字段容器，react-aria-components 基础组件

**设计语言**: 微拟物 = 渐变背景 + 立体阴影 + 微交互
- 凸起元素: 外投影 + 顶部高光 (使用 --neumorphic-elevated)
- 内凹元素: 内阴影 (使用 --neumorphic-inset)
- 颜色: 禁止硬编码，必须使用 CSS 变量 + color-mix
- **阴影系统**: 所有阴影从 index.css 的 --neumorphic-* 变量继承，自动适配深色模式
- **动画**: 所有交互使用 Spring 物理 (来自 lib/motion.js)
  - Button: snappy (400/30) hover + tap
  - Card: snappy hover lift
  - Input: gentle focus scale

**微拟物阴影变量** (定义于 src/index.css):
- --neumorphic-elevated / --neumorphic-elevated-hover: 凸起卡片
- --neumorphic-inset / --neumorphic-inset-hover: 内凹元素
- --neumorphic-flat / --neumorphic-flat-hover: 扁平元素
- --neumorphic-input / --neumorphic-input-focus: 输入框
- --neumorphic-badge-sm / --neumorphic-badge-highlight: 徽章
- --neumorphic-highlight / --neumorphic-highlight-hover: 顶部高光

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
