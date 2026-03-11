/**
 * [INPUT]: 依赖 node:test, node:assert/strict, shared/wallpaper-core.js
 * [OUTPUT]: WCAG 对比度 + 前景色 override 行为回归测试
 * [POS]: tests/ 颜色对比度护栏，约束共享核心按 WCAG 对比度择优而非经验阈值
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { test } from "node:test"
import assert from "node:assert/strict"

import {
    getLuminance,
    getContrastRatio,
    getContrastBase,
    resolveContrastBase,
    contrastAlpha
} from "../shared/wallpaper-core.js"

/* ========================================================================
   WCAG 对比度行为
   ======================================================================== */

test("getContrastRatio matches WCAG contrast math for black and white", () => {
    assert.equal(getContrastRatio("#000000", "#FFFFFF"), 21)
    assert.equal(getContrastRatio("#FFFFFF", "#000000"), 21)
})

test("getContrastBase returns black text for bright backgrounds", () => {
    // 纯白 luminance=1.0 → 黑色文字
    assert.equal(getContrastBase("#FFFFFF"), "0,0,0")
})

test("getContrastBase returns white text for dark backgrounds", () => {
    // 纯黑 luminance=0.0 → 白色文字
    assert.equal(getContrastBase("#000000"), "255,255,255")
})

test("getContrastBase chooses the higher-contrast monochrome via WCAG ratio", () => {
    const midGrayLum = getLuminance("#777777")
    const blackContrast = getContrastRatio("#000000", "#777777")
    const whiteContrast = getContrastRatio("#FFFFFF", "#777777")

    assert.ok(midGrayLum > 0.179, `#777777 luminance ${midGrayLum} should exceed the historical split`)
    assert.ok(blackContrast > whiteContrast, "black should beat white on #777777")
    assert.equal(getContrastBase("#777777"), "0,0,0")

    const darkGrayLum = getLuminance("#6F6F6F")
    const darkBlackContrast = getContrastRatio("#000000", "#6F6F6F")
    const darkWhiteContrast = getContrastRatio("#FFFFFF", "#6F6F6F")

    assert.ok(darkGrayLum < 0.179, `#6F6F6F luminance ${darkGrayLum} should be below the historical split`)
    assert.ok(darkWhiteContrast > darkBlackContrast, "white should beat black on #6F6F6F")
    assert.equal(getContrastBase("#6F6F6F"), "255,255,255")
})

/* ========================================================================
   resolveContrastBase 覆盖逻辑
   ======================================================================== */

test("resolveContrastBase returns auto value when override is null", () => {
    assert.equal(resolveContrastBase("#000000", null), "255,255,255")
    assert.equal(resolveContrastBase("#FFFFFF", null), "0,0,0")
})

test("resolveContrastBase returns light when override is #FFFFFF", () => {
    // 即使背景是白色（正常应该返回黑字），override 强制白字
    assert.equal(resolveContrastBase("#FFFFFF", "#FFFFFF"), "255,255,255")
    assert.equal(resolveContrastBase("#000000", "#FFFFFF"), "255,255,255")
})

test("resolveContrastBase returns dark when override is #000000", () => {
    // 即使背景是黑色（正常应该返回白字），override 强制黑字
    assert.equal(resolveContrastBase("#000000", "#000000"), "0,0,0")
    assert.equal(resolveContrastBase("#FFFFFF", "#000000"), "0,0,0")
})

/* ========================================================================
   contrastAlpha 第三参数透传
   ======================================================================== */

test("contrastAlpha respects foreground override", () => {
    // 黑色背景 + null override → 白色 rgba
    assert.equal(contrastAlpha("#000000", 0.5, null), "rgba(255,255,255, 0.5)")

    // 黑色背景 + #000000 override → 强制黑色 rgba
    assert.equal(contrastAlpha("#000000", 0.5, "#000000"), "rgba(0,0,0, 0.5)")
})

test("contrastAlpha defaults to auto when no override provided", () => {
    // 向后兼容：不传第三参数 = null = auto
    assert.equal(contrastAlpha("#000000", 0.5), "rgba(255,255,255, 0.5)")
    assert.equal(contrastAlpha("#FFFFFF", 0.5), "rgba(0,0,0, 0.5)")
})
