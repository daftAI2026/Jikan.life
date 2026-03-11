# lock-screen-overlay/
> L2 | 父级: /src/pages/registry/sections/workspace/CLAUDE.md

成员清单
LockScreenOverlay.jsx: overlay 渲染器，固定 `402x874` 坐标系；Widgets/Status 继续 inline，主时钟改为 `120/Bold` 的居中文本并输出真实 24 小时制时间，左上角时间同步改成真实时间，普通文本统一复用 overlay 文本字体策略，widget icon 几何改由私有 symbols 模块注入，`date-text` 保持真实英文日期，Stack 改用 `lock-screen-controls.svg` 静态资源
lock-screen-overlay.symbols.js: overlay 私有 icon 几何仓库，集中承载 `applewatch` / `umbrella.fill` / `sun.horizon.fill` 原始 SVG path，供渲染器按固定缩放复用
lock-screen-overlay.colors.js: overlay 私有配色映射层，把 workspace accentColor 投影到主时钟/日期/widgets，把 workspace bgColor 按现有背景明暗规则投影到整条 top 状态栏与 home indicator 的 pure black/white palette token，并为 `swipe-indicator` 生成基于 bgColor 的真机近似拟合色；维持 widgets `fg = accent / bg = accent 15% alpha` 关系
lock-screen-overlay.runtime.js: overlay runtime 策略层，负责英文日期格式化、24 小时制时间格式、Apple 平台判定、英文字体分流与分钟/午夜刷新计时
lock-screen-overlay.constants.js: overlay 协议常量，定义公开 layer id 列表与默认 overlay 配色
index.js: 子模块聚合出口，向 `LockScreenPreviewFrame` 暴露组件与颜色协议

法则: 坐标固定·layer id 稳定·颜色入口集中·日期/时间 runtime 化但几何不漂移·accent 驱动主时钟/日期/widgets·top 状态栏与 home indicator 仅由 bgColor 明暗驱动 pure black/white token·swipe-indicator 由 bgColor 动态拟合·Sketch live 层级优先·Stack 静态化例外·禁止回退整图黑盒

变更日志
2026-03-11: overlay 组件与协议常量正式去掉 `dark` 历史命名；静态资源路径同步收平到 `public/preview/iPhone/lock-screen-*.svg`，目录语义从版本号回归机型。
2026-03-11: `lock-screen-overlay.colors.js` 为 `swipe-indicator` 新增基于全局 `bgColor` 的真机近似拟合链：极亮/极暗背景收敛到 `#CDD1CC/#404040` 中性灰，中间有色背景保留 hue 并提亮降饱和；`createLockScreenTopOverlayColors()` 现显式返回 `swipe-indicator`，但顶部 status bar 与 home indicator 既有 token 规则不变。
2026-03-11: 顶部 status bar 与 `home-indicator` 从 `kumo default/inverse` 语义文字 token 切到 `var(--color-black)` / `var(--color-white)` 纯色 palette token；规则仍只由 `bgColor` 明暗驱动，`swipe-indicator` 的拟合链保持不变。
2026-03-11: `LockScreenOverlay.jsx` 彻底删除 `dynamic-island` 中岛黑条，同时从 `lock-screen-overlay.constants.js` 移除对应 layer id 与默认配色；顶部状态栏其余几何与属性保持不动。
2026-03-11: `widgets-complication-1` 从写死 `72/52/89` 的数字型小组件切换为直接内联 jikan Sketch `iwatch` 原始 SVG；中心图标进一步改为内联 `applewatch` monochrome path，继续复用既有 `widgets-complication-1-bg/fg` 颜色协议。
2026-03-11: `widgets-complication-3/4` 的 `SF Symbols` 字体 glyph 替换为内联 `umbrella.fill` / `sun.horizon.fill` 原始 SVG，并按现有项目字号锁定固定缩放，彻底去掉 widget 图标的字体依赖。
2026-03-11: 新增 `lock-screen-overlay.symbols.js`，把 widget icon 原始 SVG path 从渲染器内联常量下沉到私有几何仓库，保持组件只负责布局与固定 transform。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
