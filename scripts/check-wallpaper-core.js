/**
 * [INPUT]: 依赖 shared/wallpaper-core.js 的 compute*Layout 与日期工具
 * [OUTPUT]: 控制台输出检查结果，非零退出码表示失败
 * [POS]: scripts/ 下的核心算法自检脚本
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import {
    computeGoalLayout,
    computeLifeLayout,
    getDayOfYear
} from '../shared/wallpaper-core.js';

const BASE_OPTIONS = {
    width: 1200,
    height: 2400,
    bgColor: '000000',
    accentColor: 'FFFFFF',
    clockHeight: 0.22,
    lang: 'en'
};

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function runTest(name, fn) {
    try {
        fn();
        console.log(`[OK] ${name}`);
        return true;
    } catch (error) {
        console.error(`[FAIL] ${name}`);
        console.error(error.message);
        return false;
    }
}

const tests = [
    {
        name: 'DST start day diff (2025-03-09 -> 2025-03-10)',
        fn: () => {
            const layout = computeGoalLayout({
                ...BASE_OPTIONS,
                goalDate: '2025-03-10',
                today: { year: 2025, month: 3, day: 9 }
            });
            assert(layout.daysRemaining === 1, `Expected 1 day remaining, got ${layout.daysRemaining}`);
        }
    },
    {
        name: 'DST end day diff (2025-11-02 -> 2025-11-03)',
        fn: () => {
            const layout = computeGoalLayout({
                ...BASE_OPTIONS,
                goalDate: '2025-11-03',
                today: { year: 2025, month: 11, day: 2 }
            });
            assert(layout.daysRemaining === 1, `Expected 1 day remaining, got ${layout.daysRemaining}`);
        }
    },
    {
        name: 'Leap year day-of-year (2024-02-29 -> 60)',
        fn: () => {
            const dayOfYear = getDayOfYear(2024, 2, 29);
            assert(dayOfYear === 60, `Expected day 60, got ${dayOfYear}`);
        }
    },
    {
        name: 'Goal date in past clamps progress to 100%',
        fn: () => {
            const layout = computeGoalLayout({
                ...BASE_OPTIONS,
                goalDate: '2025-01-09',
                today: { year: 2025, month: 1, day: 10 }
            });
            assert(layout.daysRemaining === 0, `Expected 0 days remaining, got ${layout.daysRemaining}`);
            assert(layout.ring.progress === 1, `Expected progress 1, got ${layout.ring.progress}`);
        }
    },
    {
        name: 'Future DOB has no current week',
        fn: () => {
            const layout = computeLifeLayout({
                ...BASE_OPTIONS,
                dob: '2030-01-01',
                lifespan: 80,
                today: { year: 2025, month: 1, day: 1 }
            });
            const hasCurrentWeek = layout.dots.some(dot => dot.isCurrentWeek);
            const hasLived = layout.dots.some(dot => dot.isLived);
            assert(!hasCurrentWeek, 'Expected no current week highlight');
            assert(!hasLived, 'Expected no lived weeks');
        }
    },
    {
        name: 'Over-lifespan clamps to all lived and no current week',
        fn: () => {
            const layout = computeLifeLayout({
                ...BASE_OPTIONS,
                dob: '1900-01-01',
                lifespan: 80,
                today: { year: 2025, month: 1, day: 1 }
            });
            const hasCurrentWeek = layout.dots.some(dot => dot.isCurrentWeek);
            const allLived = layout.dots.every(dot => dot.isLived);
            assert(!hasCurrentWeek, 'Expected no current week highlight');
            assert(allLived, 'Expected all weeks to be lived');
        }
    },
    {
        name: 'Radius never negative under tiny size/large lifespan',
        fn: () => {
            const layout = computeLifeLayout({
                ...BASE_OPTIONS,
                width: 320,
                height: 480,
                dob: '2000-01-01',
                lifespan: 120,
                today: { year: 2025, month: 1, day: 1 }
            });
            const minRadius = Math.min(...layout.dots.map(dot => dot.radius));
            assert(minRadius >= 0, `Expected non-negative radius, got ${minRadius}`);
        }
    }
];

const results = tests.map(test => runTest(test.name, test.fn));
const failed = results.filter(result => !result).length;

if (failed > 0) {
    console.error(`\n${failed} test(s) failed.`);
    process.exit(1);
}

console.log('\nAll checks passed.');
