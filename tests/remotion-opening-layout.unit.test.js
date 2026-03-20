/**
 * [INPUT]: 依赖 node:test/node:assert 与 remotion/opening-layout 的三列排版纯函数
 * [OUTPUT]: 开场文字布局单元测试，锁定中心安全区、细光标尺寸与长文本自适应缩放语义
 * [POS]: tests/ 的 Remotion 几何护栏，防止左右文本跨过中心、打字机光标过粗导致视觉失衡
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { test } from "node:test"
import assert from "node:assert/strict"

async function loadOpeningLayoutModule() {
    return import("../remotion/opening-layout.js").catch(() => ({}))
}

test("keeps left and right lanes out of the center safety zone", async () => {
    const { resolveOpeningLayoutMetrics } = await loadOpeningLayoutModule()

    assert.equal(typeof resolveOpeningLayoutMetrics, "function")

    const metrics = resolveOpeningLayoutMetrics({
        width: 576,
        leftText: "Tiempo",
        centerText: "y",
        rightText: "Vida",
    })

    const centerX = 576 / 2

    assert.ok(metrics.leftLaneRightEdge < centerX)
    assert.ok(metrics.rightLaneLeftEdge > centerX)
    assert.equal(metrics.outerPadding, 0)
    assert.equal(metrics.gap, 0)
    assert.equal(metrics.leftLaneLeftEdge, 0)
    assert.equal(metrics.leftLaneRightEdge, metrics.centerLeftEdge)
    assert.equal(metrics.rightLaneLeftEdge, metrics.centerRightEdge)
    assert.equal(metrics.leftLaneWidth, metrics.leftLaneRightEdge - metrics.leftLaneLeftEdge)
    assert.equal(metrics.rightLaneWidth, 576 - metrics.rightLaneLeftEdge)
    assert.ok(metrics.sideWidth > 0)
})

test("keeps the same inner-boundary contract on phone-width outer frames", async () => {
    const { resolveOpeningLayoutMetrics } = await loadOpeningLayoutModule()

    assert.equal(typeof resolveOpeningLayoutMetrics, "function")

    const metrics = resolveOpeningLayoutMetrics({
        width: 113,
        leftText: "shí jiān",
        centerText: "und",
        rightText: "rén shēng",
    })

    assert.ok(metrics.centerReserve > 0)
    assert.ok(metrics.centerReserve < 113)
    assert.equal(metrics.outerPadding, 0)
    assert.equal(metrics.gap, 0)
    assert.ok(metrics.sideWidth > 0)
    assert.equal(metrics.leftLaneLeftEdge, 0)
    assert.equal(metrics.leftLaneRightEdge, metrics.centerLeftEdge)
    assert.equal(metrics.rightLaneLeftEdge, metrics.centerRightEdge)
})

test("lets side lanes eat the full remaining width outside the center reserve", async () => {
    const { resolveOpeningLayoutMetrics } = await loadOpeningLayoutModule()

    assert.equal(typeof resolveOpeningLayoutMetrics, "function")

    const metrics = resolveOpeningLayoutMetrics({
        width: 432,
        leftText: "Time",
        centerText: "&",
        rightText: "Life",
    })

    assert.equal(metrics.leftLaneWidth + (metrics.centerRightEdge - metrics.centerLeftEdge) + metrics.rightLaneWidth, 432)
    assert.equal(metrics.leftLaneWidth, metrics.centerLeftEdge)
    assert.equal(metrics.rightLaneWidth, 432 - metrics.centerRightEdge)
})

test("pins the center safety zone to 125px whenever middle text exists", async () => {
    const { resolveOpeningLayoutMetrics } = await loadOpeningLayoutModule()

    assert.equal(typeof resolveOpeningLayoutMetrics, "function")

    const shortCenterWithQuietSides = resolveOpeningLayoutMetrics({
        width: 432,
        leftText: "Time",
        centerText: "&",
        rightText: "Life",
    })
    const shortCenterWithNoisySides = resolveOpeningLayoutMetrics({
        width: 432,
        leftText: "shí jiān shí jiān shí jiān",
        centerText: "&",
        rightText: "rén shēng rén shēng rén shēng",
    })
    const longCenter = resolveOpeningLayoutMetrics({
        width: 432,
        leftText: "Time",
        centerText: "und",
        rightText: "Life",
    })

    assert.equal(shortCenterWithQuietSides.centerReserve, shortCenterWithNoisySides.centerReserve)
    assert.equal(shortCenterWithQuietSides.centerReserve, 125)
    assert.equal(shortCenterWithNoisySides.centerReserve, 125)
    assert.equal(longCenter.centerReserve, 125)
})

test("applies a direct 0.6 center scale to und instead of the default 0.72", async () => {
    const { resolveOpeningLayoutMetrics } = await loadOpeningLayoutModule()

    assert.equal(typeof resolveOpeningLayoutMetrics, "function")

    const undMetrics = resolveOpeningLayoutMetrics({
        width: 432,
        leftText: "Time",
        centerText: "und",
        rightText: "Life",
    })
    const etMetrics = resolveOpeningLayoutMetrics({
        width: 432,
        leftText: "Time",
        centerText: "et",
        rightText: "Life",
    })

    assert.equal(undMetrics.lineFontSize, etMetrics.lineFontSize)
    assert.equal(undMetrics.centerReserve, etMetrics.centerReserve)
    assert.equal(undMetrics.centerFontSize, Math.round(undMetrics.lineFontSize * 0.6))
    assert.equal(etMetrics.centerFontSize, Math.round(etMetrics.lineFontSize * 0.72))
    assert.ok(undMetrics.centerFontSize < etMetrics.centerFontSize)
})

test("drops the center safety zone entirely when the scene has no middle text", async () => {
    const { resolveOpeningLayoutMetrics } = await loadOpeningLayoutModule()

    assert.equal(typeof resolveOpeningLayoutMetrics, "function")

    const metrics = resolveOpeningLayoutMetrics({
        width: 432,
        leftText: "",
        centerText: "",
        rightText: "",
        lineText: "jikan.life",
    })

    assert.equal(metrics.centerReserve, 0)
    assert.equal(metrics.centerFontSize, 0)
})

test("shrinks latin-heavy rows below the short CJK rows", async () => {
    const { resolveOpeningLayoutMetrics } = await loadOpeningLayoutModule()

    assert.equal(typeof resolveOpeningLayoutMetrics, "function")

    const shortMetrics = resolveOpeningLayoutMetrics({
        width: 576,
        leftText: "時間",
        centerText: "与",
        rightText: "人生",
    })
    const longMetrics = resolveOpeningLayoutMetrics({
        width: 576,
        leftText: "shí jiān",
        centerText: "&",
        rightText: "rén shēng",
    })

    assert.ok(longMetrics.lineFontSize < shortMetrics.lineFontSize)
    assert.ok(longMetrics.lineFontSize >= 12)
})

test("fits the ending single-line lockup inside the fixed animation area", async () => {
    const { resolveOpeningLayoutMetrics } = await loadOpeningLayoutModule()

    assert.equal(typeof resolveOpeningLayoutMetrics, "function")

    const desktopMetrics = resolveOpeningLayoutMetrics({
        width: 576,
        leftText: "",
        centerText: "",
        rightText: "",
        lineText: "jikan.life",
    })
    const phoneMetrics = resolveOpeningLayoutMetrics({
        width: 113,
        leftText: "",
        centerText: "",
        rightText: "",
        lineText: "jikan.life",
    })

    assert.ok(desktopMetrics.lineFontSize <= 96)
    assert.ok(phoneMetrics.lineFontSize < desktopMetrics.lineFontSize)
    assert.ok(phoneMetrics.lineFontSize >= 12)
})

test("resolves a thin typewriter cursor instead of a glyph-thick bar", async () => {
    const { resolveTypewriterCursorMetrics } = await loadOpeningLayoutModule()

    assert.equal(typeof resolveTypewriterCursorMetrics, "function")

    const metrics = resolveTypewriterCursorMetrics(192)

    assert.ok(metrics.width >= 2)
    assert.ok(metrics.width <= 8)
    assert.ok(metrics.width < 192 * 0.06)
    assert.ok(metrics.height > metrics.width * 8)
    assert.ok(metrics.gap >= 4)
})
