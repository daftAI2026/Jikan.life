/**
 * [INPUT]: 依赖 shared/{wallpaper-color-core,goal-validation,wallpaper-text,layout-core,date-math}
 * [OUTPUT]: 对外提供稳定的 wallpaper-core 公共 API（兼容 facade）
 * [POS]: shared/ 对外兼容入口，保证历史 import 路径不变
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

export {
    hexToRgba,
    getLuminance,
    getContrastBase,
    resolveContrastBase,
    contrastAlpha,
    isTooClose,
    isBlackOrWhite,
    getSafeAccent
} from './wallpaper-color-core.js';

export {
    GOAL_START_MIN_ISO,
    GOAL_TARGET_MAX_ISO,
    isValidISODateString,
    isISODateInRange,
    validateGoalDateInputs
} from './goal-validation.js';

export {
    getWallpaperText,
    getWallpaperFontFamily
} from './wallpaper-text.js';

export {
    formatGoalDate,
    computeYearLayout,
    computeLifeLayout,
    computeGoalLayout
} from './layout-core.js';

export { toDayNumber, isLeapYear, getDaysInYear, getDayOfYear, getDatePartsInTimezone } from './date-math.js';
