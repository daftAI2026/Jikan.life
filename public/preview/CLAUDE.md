# preview/
> L2 | 父级: /public/CLAUDE.md

成员清单
iPhone/: iPhone 锁屏预览静态资源目录，提供网页 preview 固定外壳所需 SVG
CLAUDE.md: preview 静态资源子模块文档

结构
preview/ - 网页 preview 专用静态资源根目录（按设计稿或设备壳拆分）

架构决策
preview 目录只承载可直接托管的静态壳层资源；预览逻辑留在 `src/pages/registry/sections/workspace/`，禁止在 public 中混入业务脚本。

开发规范
新增设计壳资源时按设计源或机型建子目录，资源文件名保持语义稳定，避免版本漂移覆盖旧壳。

变更日志
2026-03-11: 旧版本号目录重命名为 `iPhone/`，并把资源文件名统一收平为 `lock-screen-bezel.svg` / `lock-screen-controls.svg`，去掉版本号与 `dark` 历史痕迹。
2026-03-10: 新增 `iPhone/`，承载 `Lock Screen` preview 外壳 SVG 资源。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
