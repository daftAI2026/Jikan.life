# lock-screen-overlay/
> L2 | 父级: /src/pages/registry/sections/workspace/CLAUDE.md

成员清单
LockScreenDarkOverlay.jsx: overlay 渲染器，固定 `402x874` 坐标系；Widgets/Status 继续 inline，主时钟改为 `120/Bold` 的居中文本并输出真实 24 小时制时间，左上角时间同步改成真实时间，普通文本统一复用 overlay 文本字体策略，SF Symbols glyph 保留独立图标字体，`date-text` 保持真实英文日期，Stack 改用 `Lock Screen - iPhone - Controls.svg` 静态资源
lock-screen-overlay.colors.js: overlay 私有配色映射层，把 workspace accentColor 投影到主时钟/日期/widgets，把 workspace bgColor 按现有背景明暗规则投影到整条 top 状态栏与 home indicator token，并维持 widgets `fg = accent / bg = accent 15% alpha` 关系
lock-screen-overlay.runtime.js: overlay runtime 策略层，负责英文日期格式化、24 小时制时间格式、Apple 平台判定、英文字体分流与分钟/午夜刷新计时
lock-screen-dark-overlay.constants.js: overlay 协议常量，定义公开 layer id 列表与默认 dark 配色
index.js: 子模块聚合出口，向 `LockScreenPreviewFrame` 暴露组件与颜色协议

法则: 坐标固定·layer id 稳定·颜色入口集中·日期/时间 runtime 化但几何不漂移·accent 驱动主时钟/日期/widgets·top 状态栏与 home indicator 仅由 bgColor 明暗驱动 token·Sketch live 层级优先·Stack 静态化例外·禁止回退整图黑盒

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
