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
        width: 1920,
        leftText: "Tiempo",
        centerText: "y",
        rightText: "Vida",
        compact: false,
    })

    const centerX = 1920 / 2
    const leftLaneRightEdge = centerX - metrics.centerReserve / 2 - metrics.gap / 2
    const rightLaneLeftEdge = centerX + metrics.centerReserve / 2 + metrics.gap / 2

    assert.ok(leftLaneRightEdge < centerX)
    assert.ok(rightLaneLeftEdge > centerX)
    assert.ok(metrics.sideWidth > 0)
})

test("shrinks latin-heavy rows below the short CJK rows", async () => {
    const { resolveOpeningLayoutMetrics } = await loadOpeningLayoutModule()

    assert.equal(typeof resolveOpeningLayoutMetrics, "function")

    const shortMetrics = resolveOpeningLayoutMetrics({
        width: 1920,
        leftText: "時間",
        centerText: "与",
        rightText: "人生",
        compact: false,
    })
    const longMetrics = resolveOpeningLayoutMetrics({
        width: 1920,
        leftText: "shí jiān",
        centerText: "&",
        rightText: "rén shēng",
        compact: false,
    })

    assert.ok(longMetrics.lineFontSize < shortMetrics.lineFontSize)
    assert.ok(longMetrics.lineFontSize >= 72)
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
