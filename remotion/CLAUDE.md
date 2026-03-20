# remotion/
> L2 | 父级: /CLAUDE.md

成员清单
index.jsx: Remotion CLI 入口，注册 `RemotionRoot` 到 Studio。
Root.jsx: 组合树注册表，暴露 `OpeningTextAnimation` 并定义默认 props / fps / Studio 方形尺寸；当前默认打开 `debugLayout` 以便在 Studio 里看三列红框。
OpeningTextComposition.jsx: 开场文字动画渲染器，负责主题切换、整张方形画布上的中心安全区与三列排版、首句 `Time & Life` 单列打字机光标与最终 `jikan.life` 单行锁定；支持可开关的 `fadeOut` / `debugLayout`，同时被首页开场遮罩复用。
opening-fonts.js: 开场字体真相源，固定首尾 `Inter`，并将首句 `Time & Life` 与最终 `jikan.life` 的单行锚点字重压到 `500`；中段继续通过共享风格组与高风险拉丁降级来约束在线随机字体，中心列现与左右列共享风格组池，但仍保留 `und` 排除 `IBM Plex Sans` 的特例；Han 字现已回到共享 CJK 随机池，只是把 `Zhi Mang Xing` 纳入可抽样候选；拉丁池新增 `Gloria Hallelujah` 作为手写风格候选。
opening-timeline.js: 开场动画纯逻辑真相源，封装首句 `Time & Life` 单列打字后停顿、闪烁输入光标、中段三列独立 seed 洗牌、三列 `慢->快->慢` 错拍节奏与整体 `1.5x` 加速后的单行 `jikan.life` 尾声。
opening-layout.js: 开场三列排版真相源，只负责整张画布上的固定 `125px` 中心安全区、左右 lane 吃满剩余宽度的边界合同与长文本缩放；已移除未接线的 `compact` 死参数。

架构决策
Remotion 模块继续保留 Studio 预览入口，但不再与网页入口隔离；首页开场通过 `@remotion/player` 直接复用 `OpeningTextComposition`，网页层只负责“全屏背景 + 固定 `1:1` 画布的外层等比缩放嵌入”，不再把 composition 尺寸绑定到浏览器 viewport。内层真相源只负责固定方形画布内部的 scene 级中心安全区与左右内侧边界，避免网页响应式和内部排版再次互相污染。

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
2026-03-20: 将 `opening-fonts.js` 的 `line` 锚点字重从 `700` 降到 `500`，让首句 `Time & Life` 与最终 `jikan.life` 保持更轻的品牌单行气质。
2026-03-14: 为首段 `Time & Life` 打字机补上细竖条光标，并将旧的硬闪切成轻微明灭，只在打字与停顿阶段出现且跟随当前输入列移动。
2026-03-20: `OpeningTextComposition.jsx` 开始同时服务 Remotion Studio 与首页 `OpeningIntroOverlay`，网页入口通过 `@remotion/player` 直接复用开场渲染器。
2026-03-20: 首页 overlay 曾读取浏览器 viewport 作为 composition 真尺寸，并将整组动态文字外框固定为浏览器宽度的 `30%`。
2026-03-20: `OpeningTextComposition.jsx` 保留 `fadeOut` 开关，但首页 overlay 不再从网页层覆盖该动画行为。
2026-03-20: `opening-layout.js` 改为只服务整张画布内部；中心安全区按 scene 中间文本驱动并落成显式中心盒子，左右列改为固定内侧边界的右对齐 / 左对齐合同，同时移除旧 `layoutScale` 语义。
2026-03-20: `opening-layout.js` 删除左右 lane 的额外缩边与列间 gap，让左右列直接吃满中心保留区之外的全部剩余宽度，继续保持左列右对齐 / 中列居中 / 右列左对齐。
2026-03-20: 删除 `opening-layout.js` 与 `OpeningTextComposition.jsx` 上从未被任何 scene 驱动的 `compact` 死参数，布局公式固定到唯一真实分支。
2026-03-20: 为 `OpeningTextComposition.jsx` 新增 `debugLayout` 调试层，但首页 overlay 不再默认从网页层强制打开它。
2026-03-20: 将 `OpeningTextComposition.jsx` 的调试描边改为 `1px` 红线，并让 `Root.jsx` 在 Remotion Studio 默认传入 `debugLayout: true`，方便直接查看 left / center / right 三个 lane 外框。
2026-03-20: `OpeningTextComposition.jsx` 不再把三列限制在中间 `30%` 小容器内，改为基于整张 composition 的 stage 宽度定位 left / center / right lane，使左右列从画布边缘直接延伸到中心保留区。
2026-03-20: 将首句 `Time & Life` 的 `intro-typewriter / intro-hold` 从三列拆分语义改为真正的单列 `lineText` 打字机语义，渲染层改为只在单行中央显示输入光标。
2026-03-20: 将 Remotion Studio 默认 composition 从 `1920x1080` 改为 `1080x1080`，把 Studio 调整体验固定到 `1:1` 方形舞台；首页 overlay 仍继续使用浏览器 viewport 真尺寸。
2026-03-20: 首页 overlay 改为与 Studio 对齐，直接嵌入固定 `1080x1080` 的 `1:1` composition，并通过外层 `min(80vw, 80vh)` 做等比缩放；网页层不再参与 Remotion 动画内部尺寸与行为调整。
2026-03-20: `opening-layout.js` 将中心安全区收敛为固定 `125px` 盒宽，并保留窄画布钳制；中间列不再随 `centerText` 长短改变盒子宽度，只通过字号回缩适配内容。
2026-03-20: `opening-timeline.js` 将整条开场时间线统一加速到 `1.5x`：intro/hold/hard cut/fade 全部按 `2/3` 帧长收缩，总时长由 `309f` 收敛到 `206f`，尾声停留同步缩短。
2026-03-20: `opening-fonts.js` 先为中心列拉丁词 `und` 增加排除规则，不再允许命中 `IBM Plex Sans`，以避免当前 Studio 视觉中过宽过硬的中段字形。
2026-03-20: `opening-fonts.js` 再将中心列字体池从独立保守池收敛回共享 `STYLE_GROUP_VARIANTS`，与左右列同源抽样，但继续保留 `und` 排除 `IBM Plex Sans` 且中心列字重/字形仍偏保守。
2026-03-20: `opening-fonts.js` 先为中心 Han 词新增手写风格预览分支，方便直接在 Studio 里看笔触感。
2026-03-20: `opening-fonts.js` 再将这条 Han 手写预览规则前移为全列通用分支，不再只限中心列。
2026-03-20: `opening-fonts.js` 将全列 Han 手写预览字体从 `WDXL Lubrifont SC/TC` 替换为 `Zhi Mang Xing`，统一以更强的行草笔触观察整体画面气质。
2026-03-20: `opening-fonts.js` 再撤销 Han 的强制手写前置分支，让 Han 字回到共享 CJK 风格组随机池，只保留 `Zhi Mang Xing` 作为可随机命中的候选之一。
2026-03-20: `opening-fonts.js` 为拉丁字体池新增 `Gloria Hallelujah`，并挂到 `editorial` 风格组里，作为可随机命中的手写拉丁候选。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
