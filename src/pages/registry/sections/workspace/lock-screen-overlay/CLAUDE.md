# lock-screen-overlay/
> L2 | 父级: /src/pages/registry/sections/workspace/CLAUDE.md

成员清单
LockScreenOverlay.jsx: overlay 渲染器，固定 `402x874` 坐标系；Widgets/Status 继续 inline，底部 controls 改为 `shadow svg + glass dom + chrome svg` 混合分层，glass DOM 现运行在和 SVG 同构的 `402x874` 绝对平面并通过 `overlayScale` 统一缩放，主时钟改为 `120/Bold` 的居中文本并输出真实 24 小时制时间，左上角时间同步改成真实时间，除 `date-text` 外其余文本继续复用既有英文 overlay 字体策略，`date-text` 单独改为真实本地日期
lock-screen-overlay.controls.js: overlay 私有 controls 几何仓库，集中承载 Sketch `Page 1 / iPhone locked / Stack` 的 frame、master/override 元数据、背景滤镜边界与左右 action icon path
lock-screen-overlay.symbols.js: overlay 私有 icon 几何仓库，集中承载 `applewatch` / `umbrella.fill` / `sun.horizon.fill` 原始 SVG path，供渲染器按固定缩放复用
lock-screen-overlay.colors.js: overlay 私有配色映射层，把 workspace accentColor 投影到主时钟/日期/widgets，把 workspace bgColor 按现有背景明暗规则投影到整条 top 状态栏、home indicator 与底部 action icon 的 pure black/white palette token，并额外生成底部 action glass 的 blur/border/highlight 材质 token；维持 widgets `fg = accent / bg = accent 15% alpha` 关系
lock-screen-overlay.runtime.js: overlay runtime 策略层，负责多语言日期格式化、24 小时制时间格式、Apple 平台判定、复用 shared 字体真相源的字体分流与分钟/午夜刷新计时
lock-screen-overlay.constants.js: overlay 协议常量，定义公开 layer id 列表与默认 overlay 配色
index.js: 子模块聚合出口，向 `LockScreenPreviewFrame` 暴露组件与颜色协议

法则: 坐标固定·layer id 稳定·颜色入口集中·日期/时间 runtime 化但几何不漂移·accent 驱动主时钟/日期/widgets·top 状态栏、home indicator 与底部 action icon 仅由 bgColor 明暗驱动 pure black/white token·底部 controls 分层固定为 `shadow svg + glass dom + chrome svg`·swipe-indicator 由 bgColor 动态拟合·Sketch live 层级优先·禁止回退整图黑盒

变更日志
2026-03-12: 锁屏 overlay 现正式消费 `wallpaperLang`，但作用域只收敛到 `date-text`：`HomePreviewPane -> LockScreenPreviewFrame -> LockScreenOverlay` 全链路透传壁纸语言，`lock-screen-overlay.runtime.js` 用显式词表手工拼接 `en / zh-CN / zh-TW / ja` 日期格式，并仅让日期行复用 `shared/wallpaper-core.js#getWallpaperFontFamily`；主时钟、状态栏时间与 widget 文本继续保持既有英文字体策略不变。
2026-03-12: 底部 action glass 的 DOM 专属视觉补偿收回到 `0px/0px`：`LockScreenOverlay.jsx` 继续保留 `ACTION_GLASS_OFFSET_X/Y` 作为 glass-only 微调入口，但当前值归零；`shadow svg` 底盘与 SVG icon 仍不参与偏移。
2026-03-12: 底部 action glass 的 DOM 专属视觉补偿从 `-1px/-1px` 继续加深到 `-3px/-3px`：`LockScreenOverlay.jsx` 仍仅通过 `ACTION_GLASS_OFFSET_X/Y` 左上微调 glass 圆盘，`shadow svg` 底盘与 SVG icon 几何不参与偏移。
2026-03-12: 在完成 glass 坐标系统一后，`LockScreenOverlay.jsx` 为 DOM glass 层恢复专属视觉补偿：`ACTION_GLASS_OFFSET_X/Y = -1`，仅让 glass 圆盘单独左移 1px、上移 1px；`shadow svg` 底盘与 SVG icon 继续停留在原始 frame，不参与偏移。
2026-03-12: `LockScreenOverlay.jsx` 将底部 action glass 从百分比定位改为和 SVG 同构的 `402x874` 绝对坐标平面：删除 `resolveActionGlassFrameStyle()`，glass DOM 直接使用 `46 / 766 / 58` 与 `298 / 766 / 58` 原始 viewBox 坐标；`LockScreenPreviewFrame.jsx` 同步透传 `overlayScale={LOCK_SCREEN_LAYOUT.scale}`，统一由 `transform: scale(overlayScale)` + `transform-origin: top left` 缩放整个 glass 平面。验收标准是重构后视觉不变，若有变化即视为实现 bug。
2026-03-11: 底部 action glass 白底透明度再次重调：`lock-screen-overlay.colors.js` 现将 dark/colored/light 三档背景透明度收口为 `0.02/0.06/0.09`，继续保留 `blur(6px)`、轻边框、顶部/左侧高光与 inset 内高光语义不变。
2026-03-11: 修正底部 action 阴影底盘的保真策略：`LockScreenOverlay.jsx` 的 `shadow svg` 层恢复为旧 `lock-screen-controls.svg` 的原始滤镜链与 `mix-blend-mode: screen` 语义，不再额外拼接自造“实体底盘 + 白色阴影片”；`lock-screen-overlay.constants.js` 的 `action-left-bg/right-bg` 默认底色同步回到原始 `rgba(..., 0.07)`，glass 面仅允许叠在上方，禁止改写底盘设计本身。
2026-03-11: 底部 action glass 白底进一步收淡：`lock-screen-overlay.colors.js` 现将 dark/colored/light 三档背景透明度收口为 `0.07/0.07/0.09`，保持现有 `blur(6px)`、边框与高光结构不变。
2026-03-11: 底部 action glass 面的材质构图现围绕圆心逆时针旋转 45 度：`LockScreenOverlay.jsx` 直接对整块 DOM glass panel 施加 `transform: rotate(-45deg)` + `transform-origin: center`，保持圆形外轮廓不变，只旋转内部边框/高光语义。
2026-03-11: 修复底部 action glass 圆盘比 SVG 阴影底盘大一圈的问题：`LockScreenOverlay.jsx` 的 DOM glass 面改为 `box-sizing: border-box`，让 1px 边框吃进既有 `58x58` frame，避免默认 `content-box` 把圆盘实际尺寸撑成 `60x60`。
2026-03-11: `LockScreenOverlay.jsx` 将底部 controls 从纯 SVG 背景升级为 `shadow svg + glass dom + chrome svg` 混合结构：保留现有 SVG 外阴影与 icon path，把圆盘实体抬到 DOM 层吃 `backdrop-filter: blur(20px) saturate(180%)`、`-webkit-backdrop-filter`、边框与顶部/左侧高光；`lock-screen-overlay.colors.js` 新增 `createLockScreenActionGlassMaterial()`，按 `bgColor` 输出 action glass 材质 token。
2026-03-11: `lock-screen-overlay.colors.js` 将 `action-left-icon` / `action-right-icon` 并入 top overlay 颜色链，和 `home-indicator` 一样仅由 `bgColor` 明暗驱动 `var(--color-black)` / `var(--color-white)`；`lock-screen-overlay.constants.js` 的默认 icon 色也同步收口为白色 token。
2026-03-11: 新增 `lock-screen-overlay.controls.js`，将 Sketch `Page 1 / iPhone locked / Stack` 的 frame/master/override 元数据与左右 action icon path 下沉为私有几何真相源；`LockScreenOverlay.jsx` 同步删除 `lock-screen-controls.svg` 黑盒 `<image>`，改为 live `Stack -> Action -> bg/icon` 结构并继续复用既有四个 action layer id。
2026-03-11: overlay 组件与协议常量正式去掉 `dark` 历史命名；静态资源路径同步收平到 `public/preview/iPhone/lock-screen-*.svg`，目录语义从版本号回归机型。
2026-03-11: `lock-screen-overlay.colors.js` 为 `swipe-indicator` 新增基于全局 `bgColor` 的真机近似拟合链：极亮/极暗背景收敛到 `#CDD1CC/#404040` 中性灰，中间有色背景保留 hue 并提亮降饱和；`createLockScreenTopOverlayColors()` 现显式返回 `swipe-indicator`，但顶部 status bar 与 home indicator 既有 token 规则不变。
2026-03-11: 顶部 status bar 与 `home-indicator` 从 `kumo default/inverse` 语义文字 token 切到 `var(--color-black)` / `var(--color-white)` 纯色 palette token；规则仍只由 `bgColor` 明暗驱动，`swipe-indicator` 的拟合链保持不变。
2026-03-11: `LockScreenOverlay.jsx` 彻底删除 `dynamic-island` 中岛黑条，同时从 `lock-screen-overlay.constants.js` 移除对应 layer id 与默认配色；顶部状态栏其余几何与属性保持不动。
2026-03-11: `widgets-complication-1` 从写死 `72/52/89` 的数字型小组件切换为直接内联 jikan Sketch `iwatch` 原始 SVG；中心图标进一步改为内联 `applewatch` monochrome path，继续复用既有 `widgets-complication-1-bg/fg` 颜色协议。
2026-03-11: `widgets-complication-3/4` 的 `SF Symbols` 字体 glyph 替换为内联 `umbrella.fill` / `sun.horizon.fill` 原始 SVG，并按现有项目字号锁定固定缩放，彻底去掉 widget 图标的字体依赖。
2026-03-11: 新增 `lock-screen-overlay.symbols.js`，把 widget icon 原始 SVG path 从渲染器内联常量下沉到私有几何仓库，保持组件只负责布局与固定 transform。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
