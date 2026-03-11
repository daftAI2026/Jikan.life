# lock-screen-overlay/
> L2 | 父级: /src/pages/registry/sections/workspace/CLAUDE.md

成员清单
LockScreenDarkOverlay.jsx: overlay 渲染器，固定 `402x874` 坐标系；Widgets/Date/Status 继续 inline，`date-text` 运行时输出真实英文日期并改为中线居中锚点，字号/字重保持不变，Stack 改用 `Lock Screen - iPhone - Controls.svg` 静态资源
lock-screen-overlay.runtime.js: overlay runtime 策略层，负责英文日期格式化、Apple 平台判定、英文字体分流与午夜刷新计时
lock-screen-dark-overlay.constants.js: overlay 协议常量，定义公开 layer id 列表与默认 dark 配色
index.js: 子模块聚合出口，向 `LockScreenPreviewFrame` 暴露组件与颜色协议

法则: 坐标固定·layer id 稳定·颜色入口集中·日期 runtime 化但几何不漂移·Sketch live 层级优先·Stack 静态化例外·禁止回退整图黑盒

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
