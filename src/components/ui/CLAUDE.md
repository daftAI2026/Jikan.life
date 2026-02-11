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
popover.jsx: 气泡弹出，Kumo Popover 适配层
tooltip.jsx: 工具提示，Kumo Tooltip 适配层
hover-card.jsx: 悬停卡片
scroll-area.jsx: 滚动区域
separator.jsx: 分割线
command.jsx: 命令面板
collapsible.jsx: 可折叠区域
slider.jsx: 滑块
calendar.jsx: 日历组件，基于 react-aria-components，支持单选/范围/月份年份选择，年份范围可配置
date-picker.jsx: 日期选择器，JollyUI 风格，支持键盘输入 + 日历弹出
datefield.jsx: 日期/时间输入字段，支持键盘输入和格式化
color.jsx: 颜色原语组件，基于 react-aria-components，导出 ColorWheel/ColorArea/ColorSwatch 等
color-picker.jsx: JollyUI(react-aria) 颜色选择器，支持 HSBA/RGBA + EyeDropper 吸管
field.jsx: 表单字段容器，react-aria-components 基础组件

**设计语言**: Kumo UI (Base UI) + Kumo Token Bridge
- 颜色: 禁止硬编码，仅使用 Kumo token 或语义变量 (var(--color-kumo-*) / var(--primary))
- 阴影: 使用 Kumo Surface + Tailwind shadow，禁止 --neumorphic-*
- 图标: 统一 @phosphor-icons/react
- 动画: 交互使用 lib/motion.js 的 Spring 预设

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
