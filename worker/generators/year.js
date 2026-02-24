/**
 * [INPUT]: 依赖 shared/wallpaper-core.js, ../svg.js, ../timezone.js
 * [OUTPUT]: generateYearCalendar 函数 (SVG string)
 * [POS]: Worker 年度进度生成器，使用共享核心计算布局
 * [PROTOCOL]: 变更时更新此头部，然后同步检查 shared/wallpaper-core.js
 */

import { createSVG, rect, circle, text, parseColor, colorWithAlpha, contrastAlpha as svgContrastAlpha } from '../svg.js';
import { getDateInTimezone } from '../timezone.js';
import {
    computeYearLayout
} from '../../shared/wallpaper-core.js';

/**
 * Generate Year Progress Calendar Wallpaper
 * Shows days of the year as a grid of dots (15 columns), highlighting completed days
 */
export function generateYearCalendar(options) {
    const {
        width,
        height,
        bgColor,
        accentColor,
        timezone,
        clockHeight = 0.22,
        lang = 'en',
        cols,
        padding,
        foregroundOverride = null
    } = options;

    // Get current date in user's timezone
    const { year, month, day } = getDateInTimezone(timezone);

    // Use shared core for layout computation
    const layout = computeYearLayout({
        width,
        height,
        bgColor,
        accentColor,
        clockHeight,
        lang,
        year,
        month,
        day,
        cols,
        padding
    });

    const content = [];
    const bgFill = parseColor(bgColor);
    const accentFill = parseColor(layout.safeAccent);
    const accentMuted = colorWithAlpha(accentFill, 0.75);
    const pendingFill = svgContrastAlpha(bgColor, 0.12, foregroundOverride);

    // Background
    content.push(rect(0, 0, width, height, bgFill));

    // Day grid as dots
    for (const dot of layout.dots) {
        let fillColor;

        if (dot.isToday) {
            fillColor = accentFill;
        } else if (dot.isCompleted) {
            fillColor = accentMuted;
        } else {
            fillColor = pendingFill;
        }

        content.push(circle(dot.cx, dot.cy, dot.radius, fillColor));
    }

    // Stats text
    const statsContent = `<tspan fill="${accentFill}" font-weight="500">${layout.stats.daysText}</tspan>` +
        `<tspan fill="${svgContrastAlpha(bgColor, 0.5, foregroundOverride)}" font-weight="500"> · ${layout.stats.completeText}</tspan>`;

    content.push(text(layout.stats.centerX, layout.stats.y, statsContent, {
        fontSize: layout.fontSize,
        textAnchor: 'middle',
        dominantBaseline: 'middle',
        escape: false
    }));

    return createSVG(width, height, content.join(''), lang);
}
