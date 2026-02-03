/**
 * [INPUT]: 依赖 shared/countries.js
 * [OUTPUT]: 对外提供时区/日期计算工具 (getDateInTimezone, getDayOfYear, normalizeTimezone)
 * [POS]: worker/ 核心工具，处理跨时区日期逻辑
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { countryTimezones, getTimezone as getSharedTimezone } from '../shared/countries.js';

export { countryTimezones };

/**
 * Get timezone from country code
 */
export function getTimezone(countryCode) {
    return getSharedTimezone(countryCode);
}

/**
 * Normalize timezone string (IANA). Returns null when invalid.
 */
export function normalizeTimezone(timezone) {
    if (!timezone) return null;
    try {
        new Intl.DateTimeFormat('en-CA', { timeZone: timezone }).format(new Date());
        return timezone;
    } catch (e) {
        return null;
    }
}

/**
 * Get current date in a specific timezone
 */
export function getDateInTimezone(timezone) {
    const now = new Date();
    const options = { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit' };
    const formatter = new Intl.DateTimeFormat('en-CA', options);
    const parts = formatter.formatToParts(now);

    const year = parseInt(parts.find(p => p.type === 'year').value);
    const month = parseInt(parts.find(p => p.type === 'month').value);
    const day = parseInt(parts.find(p => p.type === 'day').value);

    return { year, month, day };
}

/**
 * Get day of year (1-365)
 */
export function getDayOfYear(year, month, day) {
    const date = new Date(year, month - 1, day);
    const start = new Date(year, 0, 0);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}

/**
 * Get week number of year (1-52)
 */
export function getWeekOfYear(year, month, day) {
    const date = new Date(year, month - 1, day);
    const firstDayOfYear = new Date(year, 0, 1);
    const daysSinceStart = Math.floor((date - firstDayOfYear) / (1000 * 60 * 60 * 24));
    return Math.ceil((daysSinceStart + firstDayOfYear.getDay() + 1) / 7);
}

/**
 * Calculate weeks between two dates
 */
export function getWeeksBetween(startDate, endDate) {
    const msPerWeek = 7 * 24 * 60 * 60 * 1000;
    return Math.floor((endDate - startDate) / msPerWeek);
}

/**
 * Calculate days between two dates
 */
export function getDaysBetween(startDate, endDate) {
    const msPerDay = 24 * 60 * 60 * 1000;
    return Math.ceil((endDate - startDate) / msPerDay);
}

/**
 * Check if year is leap year
 */
export function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/**
 * Get total days in year
 */
export function getDaysInYear(year) {
    return isLeapYear(year) ? 366 : 365;
}
