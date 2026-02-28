/**
 * [INPUT]: 依赖 shared/countries.js 的国家到时区映射能力
 * [OUTPUT]: 对外提供 getTimezone、normalizeTimezone、getDateInTimezone
 * [POS]: worker/ 时区工具层，负责国家时区解析与时区日期归一
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { getTimezone as getSharedTimezone } from '../shared/countries.js';

/**
 * Get timezone from country code.
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
    } catch {
        return null;
    }
}

/**
 * Get current date parts in a specific timezone.
 */
export function getDateInTimezone(timezone) {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
    const parts = formatter.formatToParts(now);

    const year = Number.parseInt(parts.find((part) => part.type === 'year')?.value, 10);
    const month = Number.parseInt(parts.find((part) => part.type === 'month')?.value, 10);
    const day = Number.parseInt(parts.find((part) => part.type === 'day')?.value, 10);

    return { year, month, day };
}
