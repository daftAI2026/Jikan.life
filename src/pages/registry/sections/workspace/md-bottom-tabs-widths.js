/**
 * [INPUT]: 依赖 md 底部 tabs 的自然宽数组与容器宽度
 * [OUTPUT]: 对外提供 resolveMdBottomTabWidths，输出遵循“余量均分 / 最长项先压到次长项 / 压平后再联动收缩”的目标宽数组
 * [POS]: registry/sections/workspace 的 md bottom-tabs 宽度分配算法层，为 HomeSettingsPane 提供可测试的单一宽度真相源
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

function roundWidths(widths) {
    return widths.map((width) => Math.round(width * 1000) / 1000)
}

function growWidthsEvenly(naturalWidths, containerWidth, totalNaturalWidth) {
    const extraWidthPerTab = (containerWidth - totalNaturalWidth) / naturalWidths.length
    return roundWidths(naturalWidths.map((width) => width + extraWidthPerTab))
}

function shrinkWidthsFromLongest(naturalWidths, containerWidth, totalNaturalWidth) {
    const sortableWidths = naturalWidths
        .map((width, index) => ({ width, index }))
        .sort((left, right) => left.width - right.width)
    const resolvedWidths = sortableWidths.map(({ width }) => width)
    let deficit = totalNaturalWidth - containerWidth

    // 中文注释: 只压当前最长组，直到它们先追平下一档更短的宽度，再扩大联动范围。
    for (let startIndex = sortableWidths.length - 1; startIndex >= 0 && deficit > 0; startIndex -= 1) {
        const sharedStartIndex = startIndex
        const sharedCount = sortableWidths.length - sharedStartIndex
        const nextFloorWidth = sharedStartIndex > 0 ? resolvedWidths[sharedStartIndex - 1] : 0
        const currentWidth = resolvedWidths[sharedStartIndex]
        const reducibleWidth = (currentWidth - nextFloorWidth) * sharedCount

        if (deficit < reducibleWidth) {
            const reductionPerTab = deficit / sharedCount
            for (let tabIndex = sharedStartIndex; tabIndex < sortableWidths.length; tabIndex += 1) {
                resolvedWidths[tabIndex] -= reductionPerTab
            }
            deficit = 0
            break
        }

        for (let tabIndex = sharedStartIndex; tabIndex < sortableWidths.length; tabIndex += 1) {
            resolvedWidths[tabIndex] = nextFloorWidth
        }
        deficit -= reducibleWidth
    }

    const widthsByOriginalIndex = new Array(sortableWidths.length)
    sortableWidths.forEach(({ index }, sortableIndex) => {
        widthsByOriginalIndex[index] = Math.max(0, resolvedWidths[sortableIndex])
    })

    return roundWidths(widthsByOriginalIndex)
}

export function resolveMdBottomTabWidths({ naturalWidths, containerWidth }) {
    if (!Array.isArray(naturalWidths) || naturalWidths.length === 0) return []
    if (!Number.isFinite(containerWidth) || containerWidth <= 0) return naturalWidths

    const totalNaturalWidth = naturalWidths.reduce((sum, width) => sum + width, 0)
    if (containerWidth === totalNaturalWidth) return roundWidths(naturalWidths)
    if (containerWidth > totalNaturalWidth) return growWidthsEvenly(naturalWidths, containerWidth, totalNaturalWidth)
    return shrinkWidthsFromLongest(naturalWidths, containerWidth, totalNaturalWidth)
}
