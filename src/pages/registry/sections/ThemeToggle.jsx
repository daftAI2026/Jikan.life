/**
 * [INPUT]: 依赖 vendor/kumo ThemeToggle 实现
 * [OUTPUT]: 对外提供 ThemeToggle 主题切换薄包装
 * [POS]: registry/sections 的同源挂载点，保持 Kumo 主题行为
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
export { ThemeToggle } from "../../../../vendor/kumo/packages/kumo-docs-astro/src/components/ThemeToggle"
