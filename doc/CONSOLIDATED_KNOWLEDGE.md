/**
 * [INPUT]: 整合 doc/archive/ 目录下所有文档的核心结论、实战教训与技术细节（第三次零丢失核查版）
 * [OUTPUT]: [项目百科全书] 唯一真相源文档，涵盖架构、Kumo 迁移、组件规范、SOP 与上游对标
 * [POS]: doc 目录下的顶级知识库，取代原有碎片化文档
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

# Jikan.life 项目百科全书 (Consolidated Knowledge)

> **Version 3.0 (Definitive)**: 本文档作为 Jikan.life 项目的**唯一核心知识库**，整合了所有历史调研、架构决策与实战教训。所有后续开发必须以此为准。

---

## 🏗️ 核心架构与哲学 (Architecture & Philosophy)

### 1. 同构架构思维 (Isomorphic Design)
- **单一真相源 (SSOT)**: 
  - `shared/wallpaper-core.js` 是系统心脏。
  - **职责**: 布局计算 (`compute*Layout`) / 颜色工具 (`getSafeAccent`) / i18n 文本生成。
  - **原则**: 布局计算与渲染分离。前端 Canvas 2D 与后端 WASM SVG 必须消费同一计算结果，确保渲染 1:1 对齐。
- **布局真理**: 所有布局逻辑必须在 `compute*Layout` 函数中闭环，禁止在渲染层（Canvas/SVG）临时修改坐标。

### 2. GEB 分形文档协议
- **核心教义**: 代码是机器相，文档是语义相，两相必须同构。
- **三层结构**:
  - `L1`: `/CLAUDE.md` (项目宪法 - 技术栈与全局地图)
  - `L2`: `src/**/CLAUDE.md` (模块地图 - 成员职责)
  - `L3`: 文件头部注释 `[INPUT]/[OUTPUT]/[POS]/[PROTOCOL]` (契约)
- **执行法则**: 任何代码变更必须回环更新文档。无文档变更的代码提交被视为"孤立变更"（Fatal Error）。

---

## 🎨 Kumo UI 迁移与视觉标准 (Kumo UI Standards)

> 数据来源: `@cloudflare/kumo@1.5.0` 源码审计与本地测量

### 1. 核心技术栈 (The Real Stack)
- **底层原语**: **Base UI** (by MUI team) - 无样式 Headless 组件基座。
- **样式引擎**: **Tailwind CSS v4** + **OKLCH** Color Space。
- **暗色模式**: 
  - 🚫 **严禁**: 使用 `dark:` 前缀 (如 `dark:bg-slate-900`)。
  - ✅ **标准**: 使用 CSS 原生 `light-dark()` 函数在变量层面解决。

### 2. CSS 变量与 Token 映射表 (Strict)
| 类别 | 变量名 | Tailwind Class | 用途/定义 |
|---|---|---|---|
| **层级** | `--color-kumo-base` | `bg-kumo-base` | 最底层背景 (White/Black) |
| | `--color-kumo-elevated` | `bg-kumo-elevated` | 卡片/侧栏背景 |
| | `--color-kumo-overlay` | `text-kumo-overlay`* | 模态/遮罩层 (⚠️注: Kumo 实际多用作高亮背景) |
| **线条** | `--color-kumo-line` | `ring-kumo-line` | 分割线/边框 (Alpha 混合) |
| **文本** | `--color-kumo-default` | `text-kumo-default` | 主要文本 |
| | `--color-kumo-subtle` | `text-kumo-subtle` | 次要/说明文本 |
| | `--color-kumo-contrast` | `text-kumo-contrast` | 高亮/反白文本 |

### 3. 视觉度量 (Metrics)
- **圆角 (Radius)**:
  - 标准控件 (Button/Input/Select): `rounded-lg` (8px)。
  - 小控件 (Tooltip/Tag): `rounded-md` (6px)。
  - 容器 (Card/Popups): `rounded-lg` 或 `rounded-xl` (12px, 视场景)。
- **高度 (Height)**:
  - Base Input/Button: `h-9` (36px)。
  - Small Input/Button: `h-8` 或 `h-6.5`。
- **层级 (Z-Index)**:
  - Popover/Dropdown: `z-50`。
  - Modal: `z-modal` (9999)。

### 4. 动画与反馈 (Animation & Feedback)
- **Skeleton Line**: 
  - **定义**: 浅灰色渐变扫描效果的占位符（参考 `doc/media/skeleton_line.png`）。
  - **用途**: 用于配置项加载态或未激活态。

---

## 🧩 组件深度实战 SOP (Component Lessons)

### 1. Registry ColorPicker 改造 (2026-02-13)

**🔴 根因与教训**
- **基线混乱**: 曾因未确认"对照基线"导致无效返工。必须先确认是对齐 `main` 还是 `feature-branch`。
- **弹层混搭**: 曾混用 `react-aria overlay` 与 `Kumo popup`，导致 z-index 异常。现在统一使用 **Kumo 语义的 Popover 结构**。
- **状态回环**: 曾因 `onChange(hex)` 触发内部 HSB 转换导致的精度丢失死循环。

**✅ 操作 SOP**
1. **状态桥接**: 实行**单向约束**。
   - `External (Hex) -> Internal (HSB)`: 仅在 hex 真正变化时同步。
   - `Internal (HSB) -> External (Hex)`: 用户交互时单向输出。
2. **布局约束**:
   - 色域区域强制 `aspect-square` (1:1)。
   - 工具栏布局: `吸管(Fixed) + 空间(Fixed) + 输入框(Flex-1)`。

### 2. Registry DatePicker 弹层冲突 (2026-02-14)

**🔴 根因分析**
- **现象**: Month/Year 下拉菜单点击无反应或关闭整个 DatePicker。
- **本质**: **Overlay 体系冲突**。
  - 外层: `react-aria Popover` (DatePicker)。
  - 内层: `Kumo Select` (MonthYearPicker) -> Portal to Body。
  - 冲突: 点击 Body 上的 Select Menu 被外层 Popover 判定为 `Outside Click`。

**✅ 修复方案 (Technique)**
- **Portal 重定向**: 使用 `FloatingPortal` 将 Kumo Select 的挂载点强制重定向到 `DatePicker Content` 内部。
- **代码位置**: `src/components/ui/calendar.jsx` 中的 `FloatingPortal` 包裹层。

### 3. Sidebar Card 布局适配 (2026-02-11)

**🔴 核心教训**
- **渲染源错误**: 曾误改 `TypesSection.jsx`，而真实页面 (Registry Home) 渲染的是 `SidebarNav.tsx`。
- **SOP**: 修改样式前，务必使用 DevTools 确认组件的文件路径来源。

**✅ 视觉定案**
- **交互**: 整卡点击 (Clickable Card)，无独立 Select 按钮。
- **选中态**: 使用背景染色 `bg-kumo-tint`，而非边框高亮。
- **细节**: 移除序号 (01/02)，Year 点阵改为 12 列。

---

## 🚀 上游对标: LifeGrid (Upstream Intelligence)

> 基于 aradhyacp/LifeGrid (截至 2026-02-13)

### 1. Goal Countdown 算法差异
- **上游 (PR #16)**: 
  - 引入 `goalStart` (开始日期)。
  - 进度 = `(today - goalStart) / (goalDate - goalStart)`。
  - 语义: "这一段旅程走了多少"。
- **我们 (Current)**: 
  - 硬编码 `totalDays = 365`。
  - 进度 = `1 - daysRemaining / 365`。
- **行动**: 需在 `shared/wallpaper-core.js` 引入 `goalStart` 参数，对齐上游算法。

### 2. 功能缺口矩阵
| 功能点 | LifeGrid (上游) | Jikan.life (我们) | 判定 |
|---|---|---|---|
| **SEO** | 强 (robots, OG, JSON-LD) | 弱 (仅 Kumo 默认模板) | 🚨 High Priority |
| **i18n** | EN/ZH/JA/**FR** | EN/ZH/JA | 缺法语 |
| **Input** | 原生 `type="date"` | 混合 (Landing: Aria / Registry: Native) | 需统一体验 |

---

## 📝 待办与演化 (Future To-Do)

### Phase 1: 基础设施 (Infrastructure) ✅
- [x] **Token System**: Kumo 内部已通过 `light-dark()` 处理主题切换，`index.css` 通过 `var(--color-kumo-*)` 桥接到 shadcn 语义 token。
- [x] **Theme State**: 统一为 `mode` 单一 localStorage 键名，已移除 `ThemeToggle.jsx` 中的 `theme` 双写。

#### Token Bridge 残留审计 (2026-02-16)

`index.css` 中的 `--background`, `--border`, `--primary` 等变量是**翻译表**：将 shadcn 变量名指向 Kumo 真实 token。以下文件仍依赖此桥接，**删除桥接前必须先清理这些引用**：

**活跃渲染组件** (页面上实际跑着的):
| 文件 | 使用的 shadcn token | 备注 |
|---|---|---|
| `field.jsx` | `bg-background`, `ring-ring`, `ring-offset-background`, `text-destructive` | DateField 外壳 |
| `sonner.jsx` | `var(--border)`, `var(--radius)` | Toast 通知 |
| `color.jsx` | `ring-offset-background`, `border-foreground` | ColorSwatch 选中态 |
| `button.jsx` (CVA) | `bg-destructive`, `text-destructive-foreground` | destructive 变体 |
| `skeleton.jsx` | `bg-accent` | 加载占位符 |
| `Home.jsx` | `text-primary`, `text-muted-foreground`, `bg-primary/10`, `bg-muted` | Landing 页面 |
| `DesignSystem.jsx` | `bg-primary`, `text-muted-foreground` 等 | 设计系统展示页 |

**未渲染 shadcn 预置组件** (代码存在但页面未使用):
`dropdown-menu`, `navigation-menu`, `sheet`, `slider`, `checkbox`, `textarea`, `radio-group`, `table`, `scroll-area`, `separator`, `alert`, `accordion`, `progress`, `hover-card`

**结论**: 桥接不可删除。终局路径是将活跃组件的 shadcn token 逐个替换为 `kumo-*` 原生 token (如 `bg-background` → `bg-kumo-base`)，未渲染组件等实际使用时再决定是迁移还是删除。

### Phase 2: 组件清洗 (Component Scrub) ✅
- [x] **Remove `dark:`**: 扫描确认 `src/` 中零 `dark:` 前缀残留。
- [x] **Apply `ring`**: 活跃组件（date-picker / card / field）已从 `border` 迁移至 `ring ring-kumo-line`。低频 shadcn 预置组件保持原状。

### Phase 3: 功能对齐 (Feature Parity)
- [x] **SEO Boost**: `index.html` 补齐 Robots/OG/Twitter 元标签 (i18n: EN+CN+JP)，修正品牌名为 Jikan。
- [ ] **Goal Start**: 实现 Goal 进度算法升级 (Shared Core)。

### Phase 4: Registry 配置流体验升级 (UX Evolution)
- [ ] **Skeleton Base**: 默认初始态（未选卡片）设置区全屏展示 `Skeleton Line` 占位符。
- [ ] **Progressive 6-Grid Flow**:
    - 将右侧设置区划分为 **6 个网格 (Grids)**。
    - 选中风格卡片后，仅激活 **Grid 1**。
    - **Grid 2-6** 保持 `Skeleton Line` 持续跑动动画。
    - 交互逻辑：点击"下一步"（或完成当前 Grid 动作）后，顺序解锁下一个 Grid。
- [ ] **Full Overlay Settings**:
    - 最后一个 Grid 为"去设置"入口。
    - 点击后从最右侧推入 (Slide-in) 一个全屏面板，完全覆盖 6-Grid 视图。
    - **顶部**: 放置"如何设置" (Setup Guide) 链接。
    - **UI 展示**: 引导用户去手机设置的界面建议采用 **Layer Card** 组件进行分层展示。
    - **底部**: 放置"返回重新选择" (Back/Re-select) 按钮，点击回退至 6-Grid 配置流。

---

## 📚 原始文档索引 (Archive Reference)
> 以下文档已整合并归档至 `doc/archive/`，本表用于追溯原始细节。

- **核心哲学**: `CODE_REVIEW_STYLE.md` (Think before Act / GEB Protocol / Anti-Abstraction)
- **Kumo 标准**: `kumo_uiux_standards_baseline_2026-02-13.md`, `kumo-ui-research.md`
- **组件复盘**: `colorpicker_registry_refactor_lessons_2026-02-13.md`, `datepicker_registry_portal_conflict_lessons_2026-02-14.md`
- **上游对标**: `upstream_analysis.md`, `goalstart_integration_research_report_2026-02-13.md`
- **布局适配**: `sidebar_card_column_adaptation_report_2026-02-11.md`

*Last Verified: 2026-02-15*
