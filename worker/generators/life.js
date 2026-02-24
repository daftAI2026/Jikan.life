/**
 * [INPUT]: 依赖 shared/wallpaper-core.js, ../svg.js, ../timezone.js
 * [OUTPUT]: generateLifeCalendar 函数 (SVG string)
 * [POS]: Worker 生命日历生成器，使用共享核心计算布局，支持 foregroundOverride
 * [PROTOCOL]: 变更时更新此头部，然后同步检查 shared/wallpaper-core.js
 */

import { createSVG, rect, circle, text, parseColor, colorWithAlpha, contrastAlpha as svgContrastAlpha } from '../svg.js';
import { getDateInTimezone } from '../timezone.js';
import { computeLifeLayout } from '../../shared/wallpaper-core.js';

/**
 * Generate Life Calendar Wallpaper
 * Shows weeks of life as a grid of dots, highlighting lived weeks
 */
export function generateLifeCalendar(options) {
    const {
        width,
        height,
        bgColor,
        accentColor,
        timezone,
        dob,
        lifespan = 80,
        clockHeight = 0.22,
        lang = 'en',
        foregroundOverride = null
    } = options;

    // Use shared core for layout computation
    const today = getDateInTimezone(timezone);

    const layout = computeLifeLayout({
        width,
        height,
        bgColor,
        accentColor,
        clockHeight,
        lang,
        dob,
        lifespan,
        today
    });

    const content = [];
    const bgFill = parseColor(bgColor);
    const accentFill = parseColor(layout.safeAccent);
    const accentMuted = colorWithAlpha(accentFill, 0.75);
    const pendingFill = svgContrastAlpha(bgColor, 0.06, foregroundOverride);

    // Background
    content.push(rect(0, 0, width, height, bgFill));

    // Week grid (dots)
    for (const dot of layout.dots) {
        let fillColor;
        let radius = dot.radius;

        if (dot.isCurrentWeek) {
            fillColor = accentFill;
            radius = dot.radius * 1.15;
        } else if (dot.isLived) {
            fillColor = accentMuted;
        } else {
            fillColor = pendingFill;
        }

        content.push(circle(dot.cx, dot.cy, radius, fillColor));
    }

    // Stats text
    const statsContent = `<tspan fill="${accentFill}" font-weight="500">${layout.stats.weeksText}</tspan>` +
        `<tspan fill="${svgContrastAlpha(bgColor, 0.5, foregroundOverride)}" font-weight="500"> · ${layout.stats.livedText}</tspan>`;

    content.push(text(layout.stats.centerX, layout.stats.y, statsContent, {
        fontSize: layout.fontSize,
        textAnchor: 'middle',
        dominantBaseline: 'middle',
        escape: false
    }));

    return createSVG(width, height, content.join(''), lang);
}
