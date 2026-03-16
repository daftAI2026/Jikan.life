/**
 * [INPUT]: 依赖 HomeSidebarCards 传入的 style card 数组与当前 selectedStyle
 * [OUTPUT]: 对外提供 resolveVisibleStyleCards、resolveSidebarActiveStyleId 两个纯函数
 * [POS]: registry/sections 的 HomeSidebar 卡片语义层，统一隐藏卡过滤与移动端 active style 回退真相源
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const HIDDEN_STYLE_CARD_IDS = new Set(["life"])

function resolveVisibleStyleCards(styleCards) {
    return styleCards.filter((style) => !HIDDEN_STYLE_CARD_IDS.has(style.id))
}

function resolveSidebarActiveStyleId(selectedStyle, visibleStyleCards) {
    if (visibleStyleCards.some((style) => style.id === selectedStyle)) return selectedStyle
    return visibleStyleCards[0]?.id ?? null
}

export { resolveSidebarActiveStyleId, resolveVisibleStyleCards }
