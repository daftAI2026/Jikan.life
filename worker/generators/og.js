/**
 * [INPUT]: 依赖 ../svg.js 的 SVG 原语与共享颜色对比能力，依赖 ../../shared/wallpaper-color-core.js 的对比度基准，依赖 ../../shared/date-math.js 的日期进度真相源，依赖 ../timezone.js 的时区日期归一
 * [OUTPUT]: 对外提供 OG_IMAGE_WIDTH、OG_IMAGE_HEIGHT、OG_GRID_COLUMNS、OG_GRID_ROWS、resolveOgFilledColumns、generateOgShareSvg(options)
 * [POS]: worker OG 分享卡生成器，按参考 SVG 复刻左上 wordmark、右上 favicon、年份/完成度文案与 25 列点阵进度网格，并将年度进度映射为列亮状态
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { circle, contrastAlpha, createSVG, rect } from "../svg.js"
import { getDateInTimezone } from "../timezone.js"
import { getContrastBase } from "../../shared/wallpaper-color-core.js"
import { getDayOfYear, getDaysInYear } from "../../shared/date-math.js"

export const OG_IMAGE_WIDTH = 1200
export const OG_IMAGE_HEIGHT = 630
export const OG_GRID_COLUMNS = 25
export const OG_GRID_ROWS = 5

const OG_BACKGROUND = "#FFFFFF"
const OG_WORDMARK_FILL = "#0C0C0C"
const OG_BADGE_FILL = "#000000"
const OG_STAT_FILL = "#0C0C0C"
const OG_DOT_FILL = `rgba(${getContrastBase(OG_BACKGROUND)}, 1)`
const OG_DOT_PENDING_FILL = contrastAlpha(OG_BACKGROUND, 0.15)

const OG_WORDMARK_PATHS = [
    "M507.449 129.432V59.6138H552.858V70.216H520.096V89.1706H550.506V99.7729H520.096V118.83H553.131V129.432H507.449Z",
    "M451.199 129.432V59.6138H495.926V70.216H463.846V89.1706H492.858V99.7729H463.846V129.432H451.199Z",
    "M437.503 59.6138V129.432H424.855V59.6138H437.503Z",
    "M370.48 129.432V59.6138H383.128V118.83H413.878V129.432H370.48Z",
    "M349.693 130.182C347.625 130.182 345.852 129.455 344.375 128C342.898 126.546 342.17 124.773 342.193 122.682C342.17 120.637 342.898 118.887 344.375 117.432C345.852 115.978 347.625 115.25 349.693 115.25C351.693 115.25 353.432 115.978 354.909 117.432C356.409 118.887 357.17 120.637 357.193 122.682C357.17 124.069 356.807 125.33 356.102 126.466C355.42 127.603 354.511 128.512 353.375 129.194C352.261 129.853 351.034 130.182 349.693 130.182Z",
    "M328.855 59.6138V129.432H317.605L284.707 81.8751H284.128V129.432H271.48V59.6138H282.798L315.662 107.205H316.276V59.6138H328.855Z",
    "M210.977 129.432H197.477L222.057 59.6138H237.67L262.284 129.432H248.784L230.136 73.932H229.591L210.977 129.432ZM211.42 102.057H248.239V112.216H211.42V102.057Z",
    "M137.043 129.432V59.6138H149.69V91.6933H150.543L177.781 59.6138H193.225L166.225 90.9433L193.463 129.432H178.259L157.429 99.5001L149.69 108.636V129.432H137.043Z",
    "M123.347 59.6138V129.432H110.699V59.6138H123.347Z",
    "M84.4318 59.6138H96.9772V108.705C96.9545 113.205 96 117.08 94.1136 120.33C92.2272 123.557 89.5909 126.046 86.2045 127.796C82.8409 129.523 78.9204 130.386 74.4431 130.386C70.3522 130.386 66.6704 129.659 63.3977 128.205C60.1477 126.727 57.5681 124.546 55.659 121.659C53.75 118.773 52.7954 115.182 52.7954 110.886H65.375C65.3977 112.773 65.8068 114.398 66.6022 115.761C67.4204 117.125 68.5454 118.171 69.9772 118.898C71.409 119.625 73.0568 119.989 74.9204 119.989C76.9431 119.989 78.659 119.568 80.0681 118.727C81.4772 117.864 82.5454 116.591 83.2727 114.909C84.0227 113.227 84.409 111.159 84.4318 108.705V59.6138Z",
]

const OG_BADGE_PATHS = [
    "M1159 95C1159 65.1766 1134.82 41 1105 41C1075.18 41 1051 65.1766 1051 95C1051 124.823 1075.18 149 1105 149C1134.82 149 1159 124.823 1159 95ZM1165 95C1165 128.137 1138.14 155 1105 155C1071.86 155 1045 128.137 1045 95C1045 61.8629 1071.86 35 1105 35C1138.14 35 1165 61.8629 1165 95Z",
    "M1091.98 87.5137H1071.25V92.4566H1091.98V87.5137Z",
    "M1091.98 109.248H1071.25V114.19H1091.98V109.248Z",
    "M1071.25 66.3604H1076.33V119.756H1071.25V66.3604Z",
    "M1086.9 66.3604H1091.98V114.19H1086.9V66.3604Z",
    "M1091.98 66.3604H1071.25V71.3033H1091.98V66.3604Z",
    "M1123.23 88.5303H1128.59V122.04C1128.59 123.591 1128.38 124.778 1127.94 125.602C1127.51 126.475 1126.73 127.105 1125.62 127.492C1124.46 127.928 1122.94 128.195 1121.05 128.292C1119.17 128.389 1116.75 128.437 1113.81 128.437C1113.71 127.71 1113.47 126.838 1113.08 125.82C1112.74 124.851 1112.38 124.003 1111.99 123.276C1114.22 123.325 1116.25 123.349 1118.08 123.349C1119.92 123.397 1121.13 123.397 1121.71 123.349C1122.29 123.349 1122.67 123.252 1122.87 123.058C1123.11 122.864 1123.23 122.501 1123.23 121.968V88.5303Z",
    "M1104.53 104.958L1100.18 107.502C1101.38 108.811 1102.59 110.24 1103.8 111.791C1105.01 113.293 1106.1 114.795 1107.06 116.298C1108.08 117.751 1108.85 119.084 1109.38 120.296L1114.02 117.461C1113.49 116.249 1112.69 114.917 1111.63 113.463C1110.62 112.009 1109.48 110.531 1108.22 109.029C1106.97 107.526 1105.73 106.17 1104.53 104.958Z",
    "M1094.44 84.3857H1138.75V89.3287H1094.44V84.3857Z",
    "M1113.91 61.5625H1119.28V87.4402H1113.91V61.5625Z",
    "M1098.44 70.2852H1134.76V72.7203V75.1554H1098.44V70.2852Z",
    "M1094.44 97.4717H1138.75V102.415H1094.44V97.4717Z",
]

const OG_DOT_XS = [
    60.8027, 105.736, 150.669, 195.602, 240.535,
    285.468, 330.401, 375.334, 420.268, 465.201,
    510.134, 555.067, 600, 644.933, 689.866,
    734.799, 779.732, 824.666, 869.599, 914.532,
    959.465, 1004.4, 1049.33, 1094.26, 1139.2,
]

const OG_DOT_YS = [402.619, 444.264, 485.908, 527.553, 569.197]

const OG_DOT_RADIUS = 10.8027
const OG_LEFT_STAT_X = 50
const OG_LEFT_STAT_Y = 355
const OG_LEFT_STAT_FONT_SIZE = 44
const OG_LEFT_STAT_LETTER_SPACING = 0
const OG_STAT_FONT_WEIGHT = "600"
const OG_RIGHT_STAT_RIGHT_EDGE = OG_DOT_XS[OG_DOT_XS.length - 1] + OG_DOT_RADIUS
const OG_RIGHT_STAT_TEXT_WIDTH = 286.93
const OG_RIGHT_STAT_X = Number((OG_RIGHT_STAT_RIGHT_EDGE - OG_RIGHT_STAT_TEXT_WIDTH).toFixed(2))
const OG_RIGHT_STAT_Y = 354
const OG_RIGHT_STAT_FONT_SIZE = 40
const OG_RIGHT_STAT_LETTER_SPACING = 0

function renderPaths(paths, fill) {
    return paths.map((d) => `<path d="${d}" fill="${fill}" />`).join("")
}

function renderText({
    x,
    y,
    text,
    fill,
    fontSize,
    fontWeight = OG_STAT_FONT_WEIGHT,
    textAnchor = "start",
    letterSpacing = 0,
}) {
    return `<text x="${x}" y="${y}" fill="${fill}" font-size="${fontSize}" font-weight="${fontWeight}" letter-spacing="${letterSpacing}" text-anchor="${textAnchor}" dominant-baseline="alphabetic">${escapeXml(text)}</text>`
}

function escapeXml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;")
}

export function resolveOgFilledColumns(percent) {
    if (!Number.isFinite(percent)) return 0
    return Math.min(OG_GRID_COLUMNS, Math.max(0, Math.ceil(percent / 4)))
}

export function generateOgShareSvg(options = {}) {
    const today = options.today || getDateInTimezone(options.timezone)
    const dayOfYear = getDayOfYear(today.year, today.month, today.day)
    const totalDays = getDaysInYear(today.year)
    const percent = Math.round((dayOfYear / totalDays) * 100)
    const filledCols = resolveOgFilledColumns(percent)

    const content = []
    content.push(rect(0, 0, OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT, OG_BACKGROUND))
    content.push(renderPaths(OG_WORDMARK_PATHS, OG_WORDMARK_FILL))
    content.push(renderPaths(OG_BADGE_PATHS, OG_BADGE_FILL))
    content.push(
        renderText({
            x: OG_LEFT_STAT_X,
            y: OG_LEFT_STAT_Y,
            text: String(today.year),
            fill: OG_STAT_FILL,
            fontSize: OG_LEFT_STAT_FONT_SIZE,
            fontWeight: OG_STAT_FONT_WEIGHT,
            textAnchor: "start",
            letterSpacing: OG_LEFT_STAT_LETTER_SPACING,
        })
    )
    content.push(
        renderText({
            x: OG_RIGHT_STAT_X,
            y: OG_RIGHT_STAT_Y,
            text: `${percent}% Complete`,
            fill: OG_STAT_FILL,
            fontSize: OG_RIGHT_STAT_FONT_SIZE,
            fontWeight: OG_STAT_FONT_WEIGHT,
            textAnchor: "start",
            letterSpacing: OG_RIGHT_STAT_LETTER_SPACING,
        })
    )

    for (let rowIndex = 0; rowIndex < OG_GRID_ROWS; rowIndex += 1) {
        const cy = OG_DOT_YS[rowIndex]
        for (let columnIndex = 0; columnIndex < OG_GRID_COLUMNS; columnIndex += 1) {
            const cx = OG_DOT_XS[columnIndex]
            const fill = columnIndex < filledCols ? OG_DOT_FILL : OG_DOT_PENDING_FILL
            content.push(circle(cx, cy, OG_DOT_RADIUS, fill))
        }
    }

    return createSVG(OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT, content.join(""), "en")
}
