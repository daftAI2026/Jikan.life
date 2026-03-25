# generators/
> L2 | 父级: /worker/CLAUDE.md

成员清单
year.js: 年度进度 SVG 生成器，依赖 shared/wallpaper-core.js 的 computeYearLayout，输出点阵日历（默认 15 列，支持自定义），支持 foregroundOverride
life.js: 生命周历 SVG 生成器，依赖 shared/wallpaper-core.js 的 computeLifeLayout，输出 52 列周历网格，并保持当前周圆点半径与前端 Preview 同步，支持 foregroundOverride
goal.js: 目标倒计时 SVG 生成器，依赖 shared/wallpaper-core.js 的 computeGoalLayout/getWallpaperText/resolveTextFontFamily，输出环形进度条，并复用共享 Goal 渲染指标、本地化 goalDefault 与 goalName 多语言字体策略，支持 foregroundOverride
og.js: OG 分享卡 SVG 生成器，复刻参考图的左上 wordmark + 下半点阵构图，并把年度进度映射到 6x28 网格，作为 `/og-image.png?yes=1` 的专用渲染源

## 架构原则

**职责边界**：
- 本模块：SVG 标记生成（circle, rect, text, arc）
- shared/wallpaper-core.js：布局计算、颜色对比度、i18n 文本

**数据流**：
```
Worker Request → generators/*.js → shared/wallpaper-core.js (compute*Layout)
                      ↓
                  svg.js (createSVG, circle, rect, text)
                      ↓
                  SVG String → Resvg WASM → PNG
```

**同构保证**：
- 前端 Browser inline SVG 预览 (src/pages/registry/sections/workspace/{HomePreviewPane,YearPreviewSvg,GoalPreviewSvg}.jsx) 与后端 SVG 生成必须使用相同的 `compute*Layout` 函数
- 任何布局逻辑变更必须在 shared/wallpaper-core.js 中进行
- OG 分享卡仅复用年度进度真相源，不引入新的状态分支或独立算法树

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
