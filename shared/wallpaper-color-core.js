/**
 * [INPUT]: 无外部依赖（纯函数颜色数学）
 * [OUTPUT]: 对外提供 hexToRgba/getLuminance/getContrastBase/resolveContrastBase/contrastAlpha/isTooClose/isBlackOrWhite/getSafeAccent
 * [POS]: shared/ 壁纸颜色核心，供 layout-core 与 facade 复用
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

/* ========================================================================
   Color Utilities
   ======================================================================== */

export function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function getLuminance(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('');
    }
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    const toLinear = (c) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

export function getContrastBase(bgHex) {
    return getLuminance(bgHex) > 0.179 ? '0,0,0' : '255,255,255';
}

/**
 * Resolve contrast base with optional user override
 * @param {string} bgHex - Background color
 * @param {string|null} foregroundOverride - null=auto, '#FFFFFF'=light, '#000000'=dark
 * @returns {string} RGB base string
 */
export function resolveContrastBase(bgHex, foregroundOverride = null) {
    if (foregroundOverride === '#FFFFFF') return '255,255,255';
    if (foregroundOverride === '#000000') return '0,0,0';
    return getContrastBase(bgHex);
}

export function contrastAlpha(bgHex, alpha, foregroundOverride = null) {
    return `rgba(${resolveContrastBase(bgHex, foregroundOverride)}, ${alpha})`;
}

export function isTooClose(hex1, hex2) {
    const l1 = getLuminance(hex1);
    const l2 = getLuminance(hex2);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    return ratio < 2;
}

export function isBlackOrWhite(hex) {
    const luminance = getLuminance(hex);
    return luminance < 0.1 || luminance > 0.9;
}

/**
 * 获取安全的强调色
 * 规则：如果 accentHex 与背景对比度不足，则反转为黑或白
 * 同时返回 original 处理逻辑
 */
export function getSafeAccent(bgHex, accentHex) {
    if (isBlackOrWhite(accentHex) && isTooClose(bgHex, accentHex)) {
        return getLuminance(bgHex) > 0.5 ? '#000000' : '#FFFFFF';
    }
    return accentHex;
}

/**
 * 状态同步建议 (Frontend 使用):
 * 用户原始选择 -> originalAccentColor
 * 自动微调后 -> accentColor
 */
