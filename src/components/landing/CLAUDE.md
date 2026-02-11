# components/landing/
> L2 | 父级: /src/CLAUDE.md

成员清单
Hero.jsx: Above the Fold 首屏，价值主张 + 主 CTA + Hero Visual
LogoBar.jsx: 信任条，展示合作伙伴/媒体 Logo
ProblemSection.jsx: 痛点唤醒，3 列 Pain Points 卡片
TypesSection.jsx: 壁纸类型选择器 (Year/Life/Goal)，卡片点击触发 selectedType 回调
FeaturesSection.jsx: Bento Grid 功能特性展示，6 个 Feature Cards
HowItWorks.jsx: 三步流程图，带连接线的步骤卡片
CustomizeSection.jsx: 壁纸配置面板，依赖 @/lib/renderer 和 @/lib/I18nContext，Canvas 实时预览
Testimonials.jsx: 用户评价，3 列评价卡片 + 星级 + 头像
Pricing.jsx: 定价对比，3 列定价卡片 + 功能列表
FAQ.jsx: 常见问题，shadcn Accordion 组件
FinalCTA.jsx: 终极转化入口，渐变背景 + 双 CTA
LandingFooter.jsx: 极简站点底部，仅版权信息 + 社交入口
SetupSection.jsx: iOS/Android 设置教程，Tabs 平台切换 + 步骤时间线


**信息架构 (IA)**:
```
Hero → LogoBar → Problem → Features → HowItWorks → Testimonials → Pricing → FAQ → FinalCTA → Footer
```

**动效规范 (Apple Spring)**:
- 入场动画: fadeInUp + staggerContainer (Spring 300/30)
- 视口触发: whileInView + viewport={{ once: true, margin: "-100px" }}
- 微交互: hoverLift (snappy 400/25) + icon rotate/scale
- 页面过渡: pageTransition (Spring 260/40) via AnimatePresence
- 特效: floatingAnimation + pulseAnimation (无限循环)

**设计约束**:
- 颜色: 仅使用 CSS 变量 (var(--primary) 等)
- 组件: 仅使用 components/ui (Kumo 适配层 + react-aria)
- 图标: 统一 @phosphor-icons/react
- 圆角: 最小 16px，推荐 20-24px

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
