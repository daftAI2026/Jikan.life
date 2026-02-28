/**
 * [INPUT]: 依赖 node:test/node:assert/node:path/node:url 与 workspace goal-date-updater 模块
 * [OUTPUT]: Goal 日期更新器单测（range/start/date 语义矩阵）
 * [POS]: tests/ 的 Goal 日期行为锁，防止状态更新与错误语义回归
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { test } from "node:test"
import assert from "node:assert/strict"
import path from "node:path"
import { pathToFileURL } from "node:url"

const updaterModuleUrl = pathToFileURL(
    path.join(process.cwd(), "src/pages/registry/sections/workspace/goal-date-updater.js")
).href

const {
    applyGoalRangeUpdate,
    applyGoalStartUpdate,
    applyGoalDateUpdate,
} = await import(updaterModuleUrl)

function getBaseState() {
    return {
        goalStart: "2026-03-01",
        goalDate: "2026-04-01",
        goalStartError: "",
        goalDateError: "",
    }
}

test("range update writes both fields and revalidates", () => {
    const next = applyGoalRangeUpdate(getBaseState(), {
        startISO: "2026-03-10",
        endISO: "2026-03-25",
        todayISO: "2026-03-01",
    })

    assert.equal(next.goalStart, "2026-03-10")
    assert.equal(next.goalDate, "2026-03-25")
    assert.equal(next.goalStartError, "")
    assert.equal(next.goalDateError, "")
})

test("start update keeps field value when input is invalid ISO", () => {
    const prev = getBaseState()
    const next = applyGoalStartUpdate(prev, {
        value: "2026-02-30",
        todayISO: "2026-03-01",
    })

    assert.equal(next.goalStart, prev.goalStart)
    assert.equal(next.goalStartError, "error.goalStart.outOfRange")
    assert.equal(next.goalDateError, prev.goalDateError)
})

test("start update rejects commit when start is after current target", () => {
    const prev = getBaseState()
    const next = applyGoalStartUpdate(prev, {
        value: "2026-05-01",
        todayISO: "2026-03-01",
    })

    assert.equal(next.goalStart, prev.goalStart)
    assert.equal(next.goalStartError, "error.goalStart.afterTarget")
    assert.equal(next.goalDateError, "error.goalDate.beforeStart")
})

test("date update keeps field value when input is invalid ISO", () => {
    const prev = getBaseState()
    const next = applyGoalDateUpdate(prev, {
        value: "bad-input",
        todayISO: "2026-03-01",
    })

    assert.equal(next.goalDate, prev.goalDate)
    assert.equal(next.goalStartError, prev.goalStartError)
    assert.equal(next.goalDateError, "error.goalDate.outOfRange")
})

test("date update enforces today lower bound when goalStart is empty", () => {
    const prev = {
        ...getBaseState(),
        goalStart: "",
    }
    const next = applyGoalDateUpdate(prev, {
        value: "2026-02-28",
        todayISO: "2026-03-01",
    })

    assert.equal(next.goalDate, prev.goalDate)
    assert.equal(next.goalDateError, "error.goalDate.outOfRange")
})
