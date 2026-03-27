/**
 * [INPUT]: 无 (纯函数 + Math.random)
 * [OUTPUT]: 对外提供 generateRandomPalette 与 getContrastRatio
 * [POS]: shared/ 随机配色生成器，复用 WCAG 对比度规则为 UI 随机 preset 产出可读背景/强调色对
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

/* ========================================================================
   Random Palette Generator
   ======================================================================== */

function generateRandomHexColor() {
    return `#${Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")
        .toUpperCase()}`
}

function getRelativeLuminance(color) {
    const rgb = Number.parseInt(color.slice(1), 16)
    const r = (rgb >> 16) & 0xff
    const g = (rgb >> 8) & 0xff
    const b = rgb & 0xff

    const [rr, gg, bb] = [r, g, b].map((channel) => {
        const srgb = channel / 255
        return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4
    })

    return 0.2126 * rr + 0.7152 * gg + 0.0722 * bb
}

function getContrastRatio(color1, color2) {
    const luminance1 = getRelativeLuminance(color1)
    const luminance2 = getRelativeLuminance(color2)

    return (Math.max(luminance1, luminance2) + 0.05) / (Math.min(luminance1, luminance2) + 0.05)
}

function generateRandomPalette() {
    let bg = generateRandomHexColor()
    let accent = generateRandomHexColor()

    while (getContrastRatio(bg, accent) < 4.5) {
        bg = generateRandomHexColor()
        accent = generateRandomHexColor()
    }

    return { bg, accent }
}

export { generateRandomPalette, getContrastRatio }
