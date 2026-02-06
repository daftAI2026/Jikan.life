# generators/
> L2 | 父级: /worker/CLAUDE.md

成员清单
year.js: 年度进度 SVG 生成器，依赖 shared/wallpaper-core.js 的 computeYearLayout，输出点阵日历（默认 15 列，支持自定义）
life.js: 生命周历 SVG 生成器，依赖 shared/wallpaper-core.js 的 computeLifeLayout，输出 52 列周历网格
goal.js: 目标倒计时 SVG 生成器，依赖 shared/wallpaper-core.js 的 computeGoalLayout，输出环形进度条

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
- 前端 Canvas 渲染 (src/lib/renderer.js) 与后端 SVG 生成必须使用相同的 `compute*Layout` 函数
- 任何布局逻辑变更必须在 shared/wallpaper-core.js 中进行

[PROTOCOL]: 变更时更新此头部，然后同步检查 shared/wallpaper-core.js 和 src/lib/renderer.js
