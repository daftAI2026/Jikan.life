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
select.jsx: 下拉选择器
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
popover.jsx: 气泡弹出
tooltip.jsx: 工具提示
hover-card.jsx: 悬停卡片
scroll-area.jsx: 滚动区域
separator.jsx: 分割线
command.jsx: 命令面板
collapsible.jsx: 可折叠区域
slider.jsx: 滑块
calendar.jsx: 日历组件，shadcn 官方，依赖 react-day-picker
date-picker.jsx: 日期选择器，Popover + Calendar + Button 封装
color-picker.jsx: JollyUI(react-aria) 颜色选择器，支持 HSBA/RGBA + EyeDropper 吸管

**设计语言**: 微拟物 = 渐变背景 + 立体阴影 + 微交互
- 凸起元素: 外投影 + 顶部高光 (inset 0 1px 0 rgba(255,255,255,0.2))
- 内凹元素: inset 阴影
- 颜色: 禁止硬编码，必须使用 CSS 变量 + color-mix
- **动画**: 所有交互使用 Spring 物理 (来自 lib/motion.js)
  - Button: snappy (400/30) hover + tap
  - Card: snappy hover lift
  - Input: gentle focus scale

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
