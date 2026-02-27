/**
 * [INPUT]: 无
 * [OUTPUT]: 对外提供 SearchDialog 兼容占位组件（open/onOpenChange 接口）
 * [POS]: registry/sections 的搜索入口占位，避免编译期跨包依赖上游 docs 源码
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
function SearchDialog(_props) {
    return null
}

export { SearchDialog }
