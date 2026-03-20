/**
 * [INPUT]: 依赖动画外框宽度与当前三段文本，估算拉丁/CJK 混排占位
 * [OUTPUT]: 对外提供开场三列布局度量函数，返回中心安全区、左右内侧边界、字号与打字机光标尺寸
 * [POS]: remotion/ 的排版真相源，被 OpeningTextComposition 与布局单测共同消费
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max)
}

function resolveCharacterUnit(character) {
    if (/\s/u.test(character)) return 0.35
    if (/[\u3000-\u30ff\u3400-\u9fff\uf900-\ufaff]/u.test(character)) return 1
    if (/[A-Z]/u.test(character)) return 0.72
    if (/[a-z]/u.test(character)) return 0.62
    if (/[0-9]/u.test(character)) return 0.58
    return 0.55
}

function estimateTextUnits(text) {
    return [...text].reduce((sum, character) => sum + resolveCharacterUnit(character), 0)
}

const FIXED_CENTER_RESERVE_WIDTH = 125
const DEFAULT_CENTER_SCALE = 0.72
const UND_CENTER_SCALE = 0.6

function resolveCenterScale(centerText) {
    return centerText === "und" ? UND_CENTER_SCALE : DEFAULT_CENTER_SCALE
}

function resolveCenterReserve({ width, centerText, availableWidth, minSideWidth }) {
    if (!centerText) return 0

    const minReserve = Math.min(FIXED_CENTER_RESERVE_WIDTH, clamp(width * 0.22, 28, 120))
    const maxReserve = Math.max(minReserve, availableWidth - minSideWidth * 2)

    return Math.round(clamp(FIXED_CENTER_RESERVE_WIDTH, minReserve, maxReserve))
}

export function resolveTypewriterCursorMetrics(fontSize) {
    const safeFontSize = Math.max(0, fontSize)

    return {
        width: clamp(Math.round(safeFontSize * 0.028), 2, 8),
        height: Math.max(10, Math.round(safeFontSize * 0.92)),
        gap: clamp(Math.round(safeFontSize * 0.055), 4, 12),
        borderRadius: clamp(Math.round(safeFontSize * 0.01), 1, 4),
    }
}

export function resolveOpeningLayoutMetrics({ width, leftText, centerText, rightText, lineText = "" }) {
    const outerPadding = 0
    const gap = 0
    const minSideWidth = Math.round(clamp(width * 0.14, 16, 96))
    const availableWidth = Math.max(width, minSideWidth * 2 + 24)
    const centerReserve = resolveCenterReserve({
        width,
        centerText,
        availableWidth,
        minSideWidth,
    })
    const centerLeftEdge = Math.round((width - centerReserve) / 2)
    const centerRightEdge = width - centerLeftEdge
    const leftLaneRightEdge = centerLeftEdge
    const rightLaneLeftEdge = centerRightEdge
    const leftLaneWidth = Math.max(leftLaneRightEdge, 0)
    const rightLaneWidth = Math.max(width - rightLaneLeftEdge, 0)

    const baseLineFontSize = Math.round(clamp(width * 0.24, 18, 96))
    const minLineFontSize = Math.round(clamp(width * 0.11, 12, 40))
    const centerScale = resolveCenterScale(centerText)
    const sideUnitWidth = Math.max(estimateTextUnits(leftText), estimateTextUnits(rightText), 1)
    const centerUnitWidth = Math.max(estimateTextUnits(centerText), 1)
    const lineUnitWidth = estimateTextUnits(lineText)
    const sideFitFontSize = Math.min(leftLaneWidth, rightLaneWidth) / sideUnitWidth
    const lineFitFontSize = lineText
        ? width / Math.max(lineUnitWidth * 0.76, 1)
        : Number.POSITIVE_INFINITY
    const lineFontSize = Math.round(
        clamp(Math.min(baseLineFontSize, sideFitFontSize, lineFitFontSize), minLineFontSize, baseLineFontSize)
    )
    const letterSpacing = clamp(Number((width * 0.0012).toFixed(2)), 0.08, 0.5)
    const centerFontSize = Math.round(
        centerReserve > 0
            ? Math.min(lineFontSize * centerScale, centerReserve / centerUnitWidth)
            : 0
    )

    return {
        outerPadding,
        gap,
        centerReserve,
        centerLeftEdge,
        centerRightEdge,
        leftLaneLeftEdge: 0,
        leftLaneRightEdge,
        rightLaneLeftEdge,
        leftLaneWidth,
        rightLaneWidth,
        sideWidth: Math.min(leftLaneWidth, rightLaneWidth),
        lineFontSize,
        centerFontSize,
        letterSpacing,
    }
}
