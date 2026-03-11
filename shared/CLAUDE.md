# shared/
> L2 | 父级: /CLAUDE.md

成员清单
date-math.js: 日期数学真相源，导出 toDayNumber/isLeapYear/getDaysInYear/getDayOfYear/getDatePartsInTimezone，供 shared/src/worker 统一复用时区日期归一。
wallpaper-color-core.js: 壁纸颜色核心，导出 WCAG 相对亮度/对比度、自动黑白择优、强调色安全兜底与透明度计算（保留 foreground override）。
goal-validation.js: Goal 日期校验核心，导出 ISO 格式/区间/先后关系校验（1900-01-01 ~ 2100-12-31）。
wallpaper-text.js: 壁纸渲染短文案与字体解析真相源，导出 getWallpaperText/getWallpaperFontFamily/resolveTextFontFamily/resolveFontBufferLanguages，负责 goalName 的中日混排字体决策。
goal-ring-geometry.js: Goal 圆环几何真相源，导出 getGoalRingGeometry 与起始角常量，统一 Preview/Worker/HomeSidebar 的顺时针完成环参数。
layout-core.js: 壁纸布局核心，导出 YEAR_DOT_RADIUS_SCALE/YEAR_TODAY_DOT_RADIUS_SCALE 与 formatGoalDate/computeYearLayout/computeLifeLayout/computeGoalLayout（Year 支持 cols/padding 覆盖，Goal 支持 goalStart、缺省 30 天窗口、完成比例 progress 与共享渲染指标）。
wallpaper-core.js: 对外兼容 facade，聚合 re-export color/validation/text/layout/date-math（含 WCAG 对比度 helper、Year dot 尺寸常量、时区日期 helper 与 goalName 字体解析 helper），保持历史 API 与 import 路径不变。
countries.js: 国家/地区数据与时区映射，前后端共享。
palettes.js: 共享配色预设，导出 PALETTE_PRESETS/DEFAULT_PALETTE，前后端统一读取入口。

## 设计原则

**职责拆分**：颜色、日期校验、壁纸文案、布局计算分层，消除大文件混合职责。

**API 稳定**：所有消费方继续从 `shared/wallpaper-core.js` 获取同一套导出。

**消费方**：
- `src/lib/renderer.js`（Canvas 2D 适配）
- `worker/generators/*.js`（SVG 适配）

**不可包含**：任何浏览器/Node 特定 API。必须保持纯函数。

变更日志
2026-03-12: 新增 `goal-ring-geometry.js` 到共享地图并收口为真实消费链路；`layout-core.js` 的 Goal progress 语义从“剩余比例”翻回“已完成比例”，正式统一 Preview/Worker/HomeSidebar 的顺时针完成环。
2026-03-11: 颜色核心从“经验阈值切换”收敛为 WCAG 对比度决策；新增 `getContrastRatio`，`getContrastBase/getSafeAccent` 统一改为同源黑白择优逻辑，删除 accent 安全兜底里的 `0.5` 分裂阈值。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
