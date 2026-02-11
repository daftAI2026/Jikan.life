/**
 * [INPUT]: 依赖 vendor/kumo HomeGrid 实现
 * [OUTPUT]: 对外提供 HomeGrid 组件薄包装
 * [POS]: registry/components 的同源挂载点，确保与 Kumo 默认态一致
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
export { HomeGrid } from "../../../../../vendor/kumo/packages/kumo-docs-astro/src/components/demos/HomeGrid"
