/**
 * [INPUT]: 依赖 zod
 * [OUTPUT]: 对外提供 validateParams, wallpaperSchema
 * [POS]: worker/ 参数校验层，确保 URL 参数符合业务规则
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { z } from 'zod';
import {
    GOAL_START_MIN_ISO,
    GOAL_TARGET_MAX_ISO,
    isISODateInRange,
    isValidISODateString
} from '../shared/wallpaper-core.js';

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function isValidIsoDate(value) {
    return isValidISODateString(value);
}

const dateSchema = z
    .string()
    .regex(ISO_DATE_REGEX, "Invalid date format")
    .refine(isValidIsoDate, "Invalid date value");

export const wallpaperSchema = z.object({
    country: z.string().min(2).max(5).default('us').transform(val => val.toLowerCase()),
    type: z.enum(['year', 'life', 'goal']).default('year'),
    bg: z.string().regex(/^[0-9A-Fa-f]{6}$/, "Invalid hex color").default('000000'),
    accent: z.string().regex(/^[0-9A-Fa-f]{6}$/, "Invalid hex color").default('FFFFFF'),
    width: z.coerce.number().int().min(300, "Width too small").max(8000, "Width too large").default(1170),
    height: z.coerce.number().int().min(300, "Height too small").max(8000, "Height too large").default(2532),
    clockHeight: z.coerce.number().min(0).max(0.5).default(0.18),
    lang: z.enum(['en', 'zh-CN', 'zh-TW', 'ja']).default('en'),
    tz: z.string().max(100).optional(),

    // Grid Override (Optional)
    cols: z.coerce.number().int().min(1).max(53).optional(),
    padding: z.coerce.number().min(0).max(0.5).optional(),

    // Life Calendar specific
    dob: dateSchema.optional(),
    lifespan: z.coerce.number().int().min(1).max(120).default(80),

    // Goal specific
    goal: dateSchema.optional(),
    goalStart: dateSchema.optional(),
    goalName: z.string().max(100, "Goal name too long").default('Goal'),

    format: z.enum(['png', 'svg']).default('png')
}).superRefine((data, ctx) => {
    if (data.goalStart && !isISODateInRange(data.goalStart, {
        min: GOAL_START_MIN_ISO,
        max: GOAL_TARGET_MAX_ISO
    })) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['goalStart'],
            message: 'Goal start date must be between 1900-01-01 and 2100-12-31'
        });
    }

    if (data.goal && !isISODateInRange(data.goal, {
        min: GOAL_START_MIN_ISO,
        max: GOAL_TARGET_MAX_ISO
    })) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['goal'],
            message: 'Goal target date must be between 1900-01-01 and 2100-12-31'
        });
    }

    if (data.goalStart && data.goal && data.goalStart > data.goal) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['goalStart'],
            message: 'Goal start date must be on or before the goal date'
        });
    }
});

export function validateParams(url) {
    const params = Object.fromEntries(url.searchParams);
    return wallpaperSchema.parse({ ...params });
} 
