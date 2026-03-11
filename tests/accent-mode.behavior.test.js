/**
 * [INPUT]: 依赖 node:test, node:assert/strict, workspace/config-init 与 config-actions
 * [OUTPUT]: accent auto/manual 状态语义回归测试
 * [POS]: tests/ 颜色配置护栏，锁定背景联动仅在 auto 模式生效、手动 accent 不被回改
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { test } from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import path from "node:path"
import { pathToFileURL } from "node:url"

import { createConfigActions } from "../src/pages/registry/sections/workspace/config-actions.js"

async function importConfigInitModule() {
    const filePath = path.join(process.cwd(), "src/pages/registry/sections/workspace/config-init.js")
    const source = readFileSync(filePath, "utf8")
        .replace(
            `"../../../../../shared/palettes"`,
            `"${pathToFileURL(path.join(process.cwd(), "shared/palettes.js")).href}"`
        )
        .replace(
            `"../../../../../shared/wallpaper-core"`,
            `"${pathToFileURL(path.join(process.cwd(), "shared/wallpaper-core.js")).href}"`
        )

    return import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`)
}

test("initial config starts in accent auto mode", async () => {
    const { getInitialConfig } = await importConfigInitModule()
    const config = getInitialConfig("year")

    assert.equal(config.accentMode, "auto")
})

test("resolvePalette recomputes accent in auto mode when background changes", async () => {
    const { getInitialConfig, resolvePalette } = await importConfigInitModule()
    const prev = {
        ...getInitialConfig("year"),
        bgColor: "#000000",
        originalAccentColor: "#FFFFFF",
        accentColor: "#FFFFFF",
        accentMode: "auto",
    }

    const next = resolvePalette({ ...prev, bgColor: "#FFFFFF" }, prev)

    assert.equal(next.accentMode, "auto")
    assert.equal(next.accentColor, "#000000")
})

test("resolvePalette preserves manual accent when background changes", async () => {
    const { getInitialConfig, resolvePalette } = await importConfigInitModule()
    const prev = {
        ...getInitialConfig("year"),
        bgColor: "#000000",
        originalAccentColor: "#FFFFFF",
        accentColor: "#FF6600",
        accentMode: "manual",
    }

    const next = resolvePalette({ ...prev, bgColor: "#FFFFFF" }, prev)

    assert.equal(next.accentMode, "manual")
    assert.equal(next.accentColor, "#FF6600")
})

test("setAccentColor switches accent to manual mode and keeps user color", () => {
    const updates = []
    const actions = createConfigActions({
        updateConfig(payload) {
            updates.push(payload)
        },
        generateUrl() {
            return ""
        },
        todayISO: "2026-03-11",
        deps: {
            getTimezone() {
                return ""
            },
            normalizeDeviceName(value) {
                return value
            },
            clampLifespan(value) {
                return value
            },
            goalUpdateFns: {
                applyGoalRangeUpdate(prev) {
                    return prev
                },
                applyGoalStartUpdate(prev) {
                    return prev
                },
                applyGoalDateUpdate(prev) {
                    return prev
                },
            },
        },
    })

    actions.setAccentColor("#FF6600")

    assert.deepEqual(updates[0], {
        accentMode: "manual",
        originalAccentColor: "#FF6600",
        accentColor: "#FF6600",
    })
})

test("applyPalette restores accent auto mode", () => {
    const updates = []
    const actions = createConfigActions({
        updateConfig(payload) {
            updates.push(payload)
        },
        generateUrl() {
            return ""
        },
        todayISO: "2026-03-11",
        deps: {
            getTimezone() {
                return ""
            },
            normalizeDeviceName(value) {
                return value
            },
            clampLifespan(value) {
                return value
            },
            goalUpdateFns: {
                applyGoalRangeUpdate(prev) {
                    return prev
                },
                applyGoalStartUpdate(prev) {
                    return prev
                },
                applyGoalDateUpdate(prev) {
                    return prev
                },
            },
        },
    })

    actions.applyPalette("#FFFFFF", "#FFFFFF")

    assert.deepEqual(updates[0], {
        bgColor: "#FFFFFF",
        originalAccentColor: "#FFFFFF",
        accentMode: "auto",
        foregroundOverride: null,
    })
})
