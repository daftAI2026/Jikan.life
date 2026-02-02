/**
 * [INPUT]: 依赖 shared/wallpaper-core.js, ../svg.js, ../timezone.js
 * [OUTPUT]: generateYearCalendar 函数 (SVG string)
 * [POS]: Worker 年度进度生成器，使用共享核心计算布局
 * [PROTOCOL]: 变更时更新此头部，然后同步检查 shared/wallpaper-core.js
 */

import { createSVG, rect, circle, text, parseColor, colorWithAlpha, contrastAlpha as svgContrastAlpha } from '../svg.js';
import { getDateInTimezone } from '../timezone.js';
import {
    computeYearLayout,
    hexToRgba,
    getSafeAccent as coreSafeAccent
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
        lang = 'en'
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
        day
    });

    let content = '';

    // Background
    content += rect(0, 0, width, height, parseColor(bgColor));

    // Day grid as dots
    for (const dot of layout.dots) {
        let fillColor;

        if (dot.isToday) {
            fillColor = parseColor(layout.safeAccent);
        } else if (dot.isCompleted) {
            fillColor = colorWithAlpha(parseColor(layout.safeAccent), 0.75);
        } else {
            fillColor = svgContrastAlpha(bgColor, 0.12);
        }

        content += circle(dot.cx, dot.cy, dot.radius, fillColor);
    }

    // Stats text
    const statsContent = `<tspan fill="${parseColor(layout.safeAccent)}" font-family="Inter" font-weight="500">${layout.stats.daysText}</tspan>` +
        `<tspan fill="${svgContrastAlpha(bgColor, 0.5)}" font-family="Inter" font-weight="500"> · ${layout.stats.completeText}</tspan>`;

    content += text(layout.stats.centerX, layout.stats.y, statsContent, {
        fontSize: layout.fontSize,
        textAnchor: 'middle',
        dominantBaseline: 'middle',
        escape: false
    });

    return createSVG(width, height, content, lang);
}
