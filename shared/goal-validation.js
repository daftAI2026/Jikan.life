/**
 * [INPUT]: 无外部依赖（纯函数日期校验）
 * [OUTPUT]: 对外提供 GOAL_START_MIN_ISO/GOAL_TARGET_MAX_ISO/isValidISODateString/isISODateInRange/validateGoalDateInputs
 * [POS]: shared/ 目标日期校验核心，供前端与 Worker 共享
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

/* ========================================================================
   Date Validation Utilities
   ======================================================================== */

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
export const GOAL_START_MIN_ISO = '1900-01-01';
export const GOAL_TARGET_MAX_ISO = '2100-12-31';

function isValidDateParts(year, month, day) {
    if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return false;
    const date = new Date(Date.UTC(year, month - 1, day));
    return (
        date.getUTCFullYear() === year &&
        date.getUTCMonth() + 1 === month &&
        date.getUTCDate() === day
    );
}

export function isValidISODateString(value) {
    if (typeof value !== 'string' || !ISO_DATE_REGEX.test(value)) return false;
    const [year, month, day] = value.split('-').map(Number);
    return isValidDateParts(year, month, day);
}

export function isISODateInRange(value, { min, max } = {}) {
    if (!isValidISODateString(value)) return false;
    if (min && (!isValidISODateString(min) || value < min)) return false;
    if (max && (!isValidISODateString(max) || value > max)) return false;
    return true;
}

export function validateGoalDateInputs({ goalStart, goalDate, todayISO }) {
    const errors = {
        goalStartError: '',
        goalDateError: ''
    };

    if (goalStart && goalDate && isValidISODateString(goalStart) && isValidISODateString(goalDate) && goalStart > goalDate) {
        errors.goalStartError = 'error.goalStart.afterTarget';
        errors.goalDateError = 'error.goalDate.beforeStart';
        return errors;
    }

    if (goalStart) {
        const isValidStart = isISODateInRange(goalStart, {
            min: GOAL_START_MIN_ISO,
            max: GOAL_TARGET_MAX_ISO
        });
        if (!isValidStart) {
            errors.goalStartError = 'error.goalStart.outOfRange';
        }
    }

    if (goalDate) {
        let targetMinISO = GOAL_START_MIN_ISO;
        if (goalStart && isValidISODateString(goalStart)) {
            targetMinISO = goalStart;
        } else if (todayISO && isValidISODateString(todayISO)) {
            targetMinISO = todayISO;
        }

        const isValidTarget = isISODateInRange(goalDate, {
            min: targetMinISO,
            max: GOAL_TARGET_MAX_ISO
        });
        if (!isValidTarget) {
            errors.goalDateError = 'error.goalDate.outOfRange';
        }
    }

    return errors;
}
