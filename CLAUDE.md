# JIKAN - 动态人生进度墙纸生成器
Vite + React + Tailwind CSS v4 + Cloudflare Workers

<directory>
.github/ - GitHub 自动化配置 (Actions, Workflow)
doc/ - 项目文档与知识库
public/ - 前端静态资源 (Vite public)
screenshots/ - 产品/营销截图资产
dist-worker/ - Worker 构建产物 (生成)
src/ - React 前端源代码 (Vite 驱动)
  ├── components/ - UI 组件
  │   ├── landing/ - Landing Page Section 组件
  │   ├── layout/ - 布局组件 (Header, Footer)
  │   └── ui/ - shadcn/ui 原子组件
  ├── data/ - 静态数据 (i18n, countries, devices)
  ├── lib/ - 工具库 (renderer, motion, utils)
  └── assets/ - 静态资源
worker/ - Cloudflare Workers 核心后端 (Node.js/SVG 生成)
  └── generators/ - SVG 生成逻辑 adapters
shared/ - 前后端共享核心逻辑
scripts/ - 开发校验脚本
</directory>

<config>
vite.config.js - Vite 构建配置
wrangler.toml - Cloudflare Workers 部署配置
package.json - 统一依赖管理
</config>

## 技术栈
- **Frontend**: React 19 + Vite 6 + Tailwind CSS v4 + shadcn/ui
- **Backend**: Cloudflare Workers + Resvg WASM
- **Core**: Shared Rendering Logic (Canvas/SVG unified)
- **Theme**: Amethyst Haze (oklch based)

## 常用命令
- `npm run dev` - 启动前端开发服务器
- `npm run build` - 构建前端静态资源
- `npx wrangler dev` - 启动 Worker 本地开发
- `npx wrangler deploy` - 部署到 Cloudflare

## 架构法则
- **分形同构**: 代码与文档必须保持一致 (GEB Protocol)
- **渲染统一**: 前端 (Canvas) 与 后端 (SVG) 必须共享核心计算逻辑 (`shared/wallpaper-core.js`)
- **设计规范**: 一切 UI 必须基于 shadcn/ui 组件与 CSS 变量
- **状态驱动**: 所有个性化配置通过 URL 参数传递 (Stateless)
