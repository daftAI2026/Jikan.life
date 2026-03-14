/**
 * [INPUT]: 依赖 viewport 宽度与当前三段文本，估算拉丁/CJK 混排占位
 * [OUTPUT]: 对外提供开场三列布局度量函数，返回安全区、字号、列宽与打字机光标尺寸
 * [POS]: remotion/ 的排版真相源，被 OpeningTextComposition 与布局单测共同消费
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max)
}

function scaleLinear(value, inputMin, inputMax, outputMin, outputMax) {
    const progress = clamp((value - inputMin) / (inputMax - inputMin), 0, 1)
    return outputMin + (outputMax - outputMin) * progress
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
    return [...text].reduce((sum, character) => sum + resolveCharacterUnit(character), 0) || 1
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

export function resolveOpeningLayoutMetrics({ width, leftText, centerText, rightText, compact }) {
    const outerPadding = Math.round(scaleLinear(width, 720, 1920, compact ? 28 : 40, compact ? 72 : 96))
    const gap = Math.round(scaleLinear(width, 720, 1920, compact ? 14 : 24, compact ? 24 : 40))
    const centerReserve = Math.round(scaleLinear(width, 720, 1920, compact ? 92 : 132, compact ? 124 : 188))
    const sideWidth = Math.max(
        Math.round(width / 2 - outerPadding - centerReserve / 2 - gap / 2),
        Math.round(width * 0.16)
    )

    const baseLineFontSize = Math.round(scaleLinear(width, 720, 1920, 72, 192))
    const minLineFontSize = Math.round(scaleLinear(width, 720, 1920, 56, 72))
    const centerScale = compact ? 0.5 : 0.72
    const sideUnitWidth = Math.max(estimateTextUnits(leftText), estimateTextUnits(rightText))
    const centerUnitWidth = estimateTextUnits(centerText)
    const sideFitFontSize = sideWidth / (sideUnitWidth * 0.82)
    const lineFontSize = Math.round(
        clamp(Math.min(baseLineFontSize, sideFitFontSize), minLineFontSize, baseLineFontSize)
    )
    const letterSpacing = compact ? 0 : scaleLinear(width, 720, 1920, 0.25, 0.9)
    const centerFontSize = Math.round(
        Math.min(lineFontSize * centerScale, centerReserve / (centerUnitWidth * 0.82))
    )

    return {
        outerPadding,
        gap,
        centerReserve,
        sideWidth,
        lineFontSize,
        centerFontSize,
        letterSpacing,
    }
}
