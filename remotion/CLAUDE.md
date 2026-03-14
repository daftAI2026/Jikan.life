# remotion/
> L2 | 父级: /CLAUDE.md

成员清单
index.jsx: Remotion CLI 入口，注册 `RemotionRoot` 到 Studio。
Root.jsx: 组合树注册表，暴露 `OpeningTextAnimation` 并定义默认 props / fps / 尺寸。
OpeningTextComposition.jsx: 开场文字动画渲染器，负责主题切换、按列接线字体解析结果、三列排版、首段闪烁输入光标与最终 `jikan.life` 单行锁定。
opening-fonts.js: 开场字体真相源，固定首尾 `Inter`，并通过共享风格组、中心安全池与高风险拉丁降级来约束中段在线随机字体。
opening-timeline.js: 开场动画纯逻辑真相源，封装首行打字后停顿、闪烁输入光标、中段三列独立 seed 洗牌、三列 `慢->快->慢` 错拍节奏与 `9.0s -> 9.5s` 单行 `jikan.life` 尾声。
opening-layout.js: 开场三列排版真相源，收口中心安全区、列宽与长文本缩放策略。

架构决策
Remotion 模块独立于现有网页入口，只保留 Studio 预览链路；时间线与文案选择收口在 `opening-timeline.js`，三列几何与字号回缩收口在 `opening-layout.js`，渲染层只负责把纯状态映射成画面，避免动画时序和视觉排版互相污染。

开发规范
新增镜头或改时序时，先补 `tests/remotion-opening-timeline.unit.test.js`，再改 `opening-timeline.js`；修改三列排版时，先补 `tests/remotion-opening-layout.unit.test.js`，再改 `opening-layout.js`；涉及文件增删或职责重划时，同步更新本文件与根级 `CLAUDE.md`。

变更日志
2026-03-14: 初始化独立 `remotion/` 模块，新增开场文字动画组合、seed 洗牌时间线与 Studio 入口。
2026-03-14: 新增 `opening-layout.js`，把三列中心安全区与长文本缩放从 JSX 常量提升为纯布局真相源，修复左右文本跨中心重叠。
2026-03-14: 更新 `opening-timeline.js`，在 `Time & Life` 打字完成后追加独立停顿，并将中段随机切换改为左/中/右三列独立洗牌组合。
2026-03-14: 更新尾声收口，删除分列 `jikan . life` 停留段，改为 `9.0s -> 9.5s` 单行 `jikan.life`，随后直接渐隐。
2026-03-14: 为随机区左右两列新增 `慢->快->慢` 时长包络，中心列继续硬切当锚点，形成更明显的节奏缓动感。
2026-03-14: 将中心列也接入 `慢->快->慢` 包络，并给左/中/右增加小相位差，让三列在随机区里各自错拍领切。
2026-03-14: 新增 `opening-fonts.js`，将首行与最终 `jikan.life` 固定到 `Inter`，并让中段三列按脚本分类随机在线字体、字重与拉丁斜体。
2026-03-14: 重写 `opening-fonts.js` 的随机策略，改为“共享风格组 + 中心安全池 + 高风险拉丁降级”，避免三列各自乱抽导致的撞字与黑度失衡。
2026-03-14: 为首段 `Time & Life` 打字机补上细竖条光标，并将旧的硬闪切成轻微明灭，只在打字与停顿阶段出现且跟随当前输入列移动。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
