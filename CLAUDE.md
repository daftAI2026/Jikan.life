# JIKAN - 动态人生进度墙纸生成器
Vite + React + Tailwind CSS v4 + Cloudflare Workers

<directory>
.github/ - GitHub 自动化配置 (Actions, Workflow)
doc/ - 项目文档与知识库
public/ - 前端静态资源 (Vite public)
  └── api/ - 静态接口资源 (如 component-registry)
dist-worker/ - Worker 构建产物 (生成)
src/ - React 前端源代码 (Vite 驱动)
  ├── components/ - UI 组件
  │   ├── icons/ - 品牌图标组件
  │   └── ui/ - Kumo UI 适配层 (Base UI)
  ├── data/ - 静态数据 (i18n, countries, devices)
  ├── lib/ - 工具库 (motion, utils, i18n context, date-utils)
  └── pages/ - 页面模块 (registry/ Home 工作台)
tests/ - Node 原生行为回归测试 (UI 迁移护栏分层 + 核心渲染/对比度/Worker/OG 护栏)
worker/ - Cloudflare Workers 核心后端 (Node.js/SVG/OG 生成)
  └── generators/ - SVG 生成逻辑 adapters
shared/ - 前后端共享核心逻辑（按 color/validation/text/layout 模块拆分，`wallpaper-core.js` 为稳定 facade）
scripts/ - 开发校验脚本
</directory>

<config>
index.html - SPA 入口模板，同时承载首页最小离屏 SEO 语义、结构化数据、主题引导与统计脚本
vite.config.js - Vite 构建配置 (含 manualChunks 拆包策略)
wrangler.toml - Cloudflare Workers 部署与观测配置（含 `/`、`/app`、`/app/` 与 `/og-image.png` 的边缘层优先路由、Workers Logs 开关与采样率）
package.json - 统一依赖管理
doc/CODE_REVIEW_STYLE.md - Code Review 风格指南 (Core Philosophy / Anti-Abstraction / Documentation Protocol)
</config>

## 技术栈
- **Frontend**: React 19 + Vite 8 + Tailwind CSS v4 + Kumo UI (Base UI)
- **Backend**: Cloudflare Workers + Resvg WASM
- **Core**: Shared Rendering Logic (Browser inline SVG preview + Worker SVG unified)
- **Theme**: Kumo 默认主题 (light/dark)

## 常用命令
- `npm run dev` - 启动前端开发服务器
- `npm run build` - 构建前端静态资源
- `npx wrangler dev` - 启动 Worker 本地开发
- `npx wrangler deploy` - 部署到 Cloudflare

## 架构法则
- **分形同构**: 代码与文档必须保持一致 (GEB Protocol)
- **渲染统一**: 前端浏览器原生 inline SVG 预览与后端 SVG 生成必须共享同一渲染真相源（模块化核心通过 `shared/wallpaper-core.js` facade 暴露）
- **设计规范**: 一切 UI 必须基于 Kumo UI 组件与 CSS 变量
- **弹层同构**: ColorPicker 链路统一使用 Kumo Popover + Kumo Select，禁止跨体系混搭导致 z-index 竞争
- **颜色桥接**: ColorPicker 对外仅传 `hex`，内部必须维持 Color 对象状态桥，避免触底拖拽时 HSB 通道被回流重置
- **职责隔离**: ColorPicker 的状态桥接逻辑独立在 `src/components/ui/use-color-picker-state-bridge.js`，渲染组件不再内嵌同步实现
- **布局一致**: ColorPicker 色域区使用 `aspect-square` 跟随弹层内容宽度，工具栏保持 `吸管:颜色空间=1:2` 并将剩余宽度留给颜色输入框
- **手柄分层**: ColorThumb 使用外圈/中心点分层渲染（伪元素 + token），避免单层叠色造成的圆角边缘混色
- **状态驱动**: 所有个性化配置通过 URL 参数传递 (Stateless)
- **首页双相职责**: `index.html` 同时承担 React SPA 挂载入口与首页最小离屏 SEO 语义；离屏语义中的产品事实必须与 `src/data/*` 和设备可见性真相源保持一致，且不得凭空扩写 FAQ/说明页内容或打断用户首屏
- **首页 OG 可改写**: 首页 HTML 必须先经过 Worker 再回源静态资源，确保 `og:image` 能按当前请求 origin 动态改写，禁止直接从静态资产绕过 Worker 输出首页元数据
- **废弃入口前移**: 历史入口 `/app` 与 `/app/` 必须在边缘层返回 HTTP 308，禁止继续依赖 SPA 壳页面 + 前端 Navigate 作为线上主重定向路径
- **观测配置收口**: Workers Logs 开关、调用日志与采样率统一收口在 `wrangler.toml`，禁止面板手改后让本地配置失真
- **文档真相源收口**: 根目录不再保留独立 `CONTRIBUTING.md` / `MULTILINGUAL.md`；贡献约束统一看本文件，i18n 真相源统一看 `src/data/i18n.js` 与 `src/lib/I18nContext.jsx`
- **上游消费策略**: 仅通过 npm 包 `@cloudflare/kumo` + `src/components/ui/` 适配层消费上游能力，禁止页面层直引上游包
- **跨日一致**: Registry Year 预览以本地午夜为边界自动刷新，避免页面常驻时点阵与百分比停留在前一天
- **步骤卡同构**: Setup 引导步骤卡外框统一使用 Kumo `Surface`，视觉差异只允许通过 class 常量覆盖（禁止回退为分散字符串）
- **局部变量覆盖优先**: 需要调整单区域颜色语义时，优先通过作用域变量覆盖（如 `--step-list-bullet-color`），禁止直接改全局品牌色 token
- **Vendor 不可变**: 第三方包源码（`@cloudflare/kumo`）不可直接改写。需要定制样式时，在使用端通过 `className` 覆盖，或在 `src/components/ui/` 编写适配器包裹原生组件
- **样式覆盖优先级**: Kumo 组件自定义样式通过 `className` 在**使用侧**注入（如 `items-start` 覆盖 `items-center`），绝不回溯到组件声明层。图标对齐等微调用 `mt-*` / `shrink-0` 等 utility 在 icon 元素上完成
- **后端预留不等于前端暴露**: 后端可以预留扩展机制（如 `foregroundOverride`、URL 参数 `fg`），但不需要前端 UI 暴露。只有用户明确要求时才加 UI 控件，避免过度设计
