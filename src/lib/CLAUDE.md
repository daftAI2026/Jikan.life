# lib/
> L2 | 父级: /src/CLAUDE.md

成员清单
utils.js: 通用类名工具，提供 `cn()` 合并 `clsx + tailwind-merge`
motion.js: Apple 级 Framer Motion 动画预设库
I18nContext.jsx: React Context 国际化适配器，提供 I18nProvider 和 useI18n hook
date-utils.js: 本地日期工具，统一 ISO<->Date 转换、当日键生成与日偏移计算，并复用 `shared/date-math.js` 导出日历数学函数

## motion.js 动画系统


**Spring 配置**
- snappy: stiffness 400, damping 30 (~200ms) - 按钮/卡片 hover
- gentle: stiffness 300, damping 35 (~350ms) - 面板/模态框
- bouncy: stiffness 500, damping 25 (~300ms) - 弹性强调
- smooth: stiffness 200, damping 40 (~500ms) - 页面过渡
- inertia: stiffness 150, damping 20 - 惯性滑动

**动画变体**
- fadeInUp/fadeIn: 入场淡入
- scaleIn: 弹性缩放入场
- slideInLeft/slideInRight: 侧滑入场
- staggerContainer/staggerItem: 序列进场
- hoverLift/tapScale: 交互反馈
- modalOverlay/modalContent: 模态框
- pageTransition: 路由过渡
- floatingAnimation/pulseAnimation: 特效循环

**核心哲学**
```
Apple 动效 = Spring 弹簧 + 阻尼落定 + 物理惯性

规则:
- 进场用 Spring，退场用短 duration
- 阻尼值 25-40 之间
- 不超过 3 个同时动画
- 支持 prefers-reduced-motion
```

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
