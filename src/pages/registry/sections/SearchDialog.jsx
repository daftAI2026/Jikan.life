/**
 * [INPUT]: 依赖 vendor/kumo SearchDialog 实现
 * [OUTPUT]: 对外提供 SearchDialog 搜索弹窗薄包装
 * [POS]: registry/sections 的同源挂载点，保持 Kumo 搜索交互
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
export { SearchDialog } from "../../../../vendor/kumo/packages/kumo-docs-astro/src/components/SearchDialog"
