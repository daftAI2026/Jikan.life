# shared/
> L2 | 父级: /CLAUDE.md

成员清单
wallpaper-core.js: 壁纸渲染同构核心，导出 computeYearLayout/computeLifeLayout/computeGoalLayout + 日期/颜色工具(含formatGoalDate) + i18n
countries.js: 国家/地区数据与时区映射，前后端共享
palettes.js: 共享配色预设，导出 PALETTE_PRESETS/DEFAULT_PALETTE，前后端统一读取入口

## 设计原则

**单一真相源**：布局计算、颜色对比度、i18n 文本生成集中于此模块。

**消费方**：
- `src/lib/renderer.js`（Canvas 2D 适配）
- `worker/generators/*.js`（SVG 适配）

**不可包含**：任何浏览器/Node 特定 API。必须保持纯函数。

[PROTOCOL]: 变更时更新此头部，然后同步检查 renderer.js 和 worker/generators/*.js
