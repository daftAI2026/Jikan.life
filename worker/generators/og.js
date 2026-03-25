/**
 * [INPUT]: 依赖 ../svg.js 与 ../../shared/date-math.js 的日期进度真相源，依赖 ../timezone.js 的时区日期归一
 * [OUTPUT]: 对外提供 OG_IMAGE_WIDTH、OG_IMAGE_HEIGHT 与 generateOgShareSvg(options)
 * [POS]: worker OG 分享卡生成器，复刻参考图的左上 wordmark + 下半点阵构图，并将年度进度映射到 6x28 网格
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { createSVG, rect, circle } from '../svg.js';
import { getDateInTimezone } from '../timezone.js';
import { getDayOfYear, getDaysInYear } from '../../shared/date-math.js';

export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

const OG_TITLE_X = 54;
const OG_TITLE_TOP = 54;
const OG_TITLE_FONT_SIZE = 84;
const OG_TITLE_LINE_STEP = 60;
const OG_TITLE_LETTER_SPACING = -2;

const OG_GRID_COLUMNS = 28;
const OG_GRID_ROWS = 6;
const OG_GRID_START_X = 64;
const OG_GRID_END_X = 1136;
const OG_GRID_START_Y = 354;
const OG_GRID_END_Y = 562;
const OG_DOT_RADIUS = 10.5;
const OG_DOT_FILL = '#111111';
const OG_DOT_PENDING_FILL = '#D9D9D9';

function escapeXml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function renderText(x, y, content, options = {}) {
    const {
        fill = OG_DOT_FILL,
        fontSize = OG_TITLE_FONT_SIZE,
        fontWeight = '700',
        letterSpacing = OG_TITLE_LETTER_SPACING,
    } = options;

    return `<text x="${x}" y="${y}" fill="${fill}" font-size="${fontSize}" font-weight="${fontWeight}" letter-spacing="${letterSpacing}" dominant-baseline="hanging">${escapeXml(content)}</text>`;
}

function buildAxisPositions(count, start, end) {
    if (count <= 1) return [start];

    const step = (end - start) / (count - 1);
    return Array.from({ length: count }, (_, index) => start + (step * index));
}

export function generateOgShareSvg(options = {}) {
    const today = options.today || getDateInTimezone(options.timezone);
    const dayOfYear = getDayOfYear(today.year, today.month, today.day);
    const totalDays = getDaysInYear(today.year);
    const totalDots = OG_GRID_COLUMNS * OG_GRID_ROWS;
    const filledDots = Math.min(totalDots, Math.max(1, Math.ceil((dayOfYear / totalDays) * totalDots)));

    const xPositions = buildAxisPositions(OG_GRID_COLUMNS, OG_GRID_START_X, OG_GRID_END_X);
    const yPositions = buildAxisPositions(OG_GRID_ROWS, OG_GRID_START_Y, OG_GRID_END_Y);
    const content = [];

    content.push(rect(0, 0, OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT, '#FFFFFF'));
    content.push(renderText(OG_TITLE_X, OG_TITLE_TOP, 'JIKAN', { fontSize: OG_TITLE_FONT_SIZE }));
    content.push(renderText(OG_TITLE_X, OG_TITLE_TOP + OG_TITLE_LINE_STEP, '&CO', { fontSize: OG_TITLE_FONT_SIZE }));

    let dotIndex = 0;
    for (const y of yPositions) {
        for (const x of xPositions) {
            const fill = dotIndex < filledDots ? OG_DOT_FILL : OG_DOT_PENDING_FILL;
            content.push(circle(x, y, OG_DOT_RADIUS, fill));
            dotIndex += 1;
        }
    }

    return createSVG(OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT, content.join(''), 'en');
}
