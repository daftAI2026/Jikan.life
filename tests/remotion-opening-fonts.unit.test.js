/**
 * [INPUT]: 依赖 node:test/node:assert 与 remotion/opening-fonts 的开场字体解析纯函数
 * [OUTPUT]: 开场文字动画字体单元测试，锁定锚点 Inter、中段分脚本字体池、组合相容性与拉丁样式变化
 * [POS]: tests/ 的 Remotion 字体护栏，防止首尾品牌字体、中段字体编排与三列相容性策略漂移
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { test } from "node:test"
import assert from "node:assert/strict"

async function loadOpeningFontsModule() {
    return import("../remotion/opening-fonts.js").catch(() => ({}))
}

test("pins intro and final lockup to Inter while preserving lighter line anchor weights", async () => {
    const { resolveOpeningTypography } = await loadOpeningFontsModule()

    assert.equal(typeof resolveOpeningTypography, "function")

    const introLine = resolveOpeningTypography({
        seed: 7,
        sceneId: "intro",
        sceneKind: "intro-typewriter",
        column: "line",
        text: "Time & Life",
    })
    const finalLine = resolveOpeningTypography({
        seed: 7,
        sceneId: "domain-lockup-3",
        sceneKind: "domain-lockup",
        column: "line",
        text: "jikan.life",
    })

    assert.equal(introLine.primaryFontFamily, "Inter")
    assert.equal(introLine.fontWeight, 500)
    assert.equal(finalLine.primaryFontFamily, "Inter")
    assert.equal(finalLine.fontWeight, 500)
})

test("routes middle latin text into a deterministic non-Inter latin pool", async () => {
    const { OPENING_FONT_POOL_FAMILIES, resolveOpeningTypography } = await loadOpeningFontsModule()

    const first = resolveOpeningTypography({
        seed: 11,
        sceneId: "random-4",
        sceneKind: "random-cut",
        column: "left",
        text: "Tiempo",
    })
    const second = resolveOpeningTypography({
        seed: 11,
        sceneId: "random-4",
        sceneKind: "random-cut",
        column: "left",
        text: "Tiempo",
    })

    assert.deepEqual(first, second)
    assert.ok(OPENING_FONT_POOL_FAMILIES.latin.includes(first.primaryFontFamily))
    assert.notEqual(first.primaryFontFamily, "Inter")
})

test("includes Gloria Hallelujah in the latin random pool", async () => {
    const { OPENING_FONT_POOL_FAMILIES } = await loadOpeningFontsModule()

    assert.ok(OPENING_FONT_POOL_FAMILIES.latin.includes("Gloria Hallelujah"))
})

test("coordinates one shared style group across a random scene instead of letting columns freestyle", async () => {
    const { resolveOpeningTypography } = await loadOpeningFontsModule()

    const left = resolveOpeningTypography({
        seed: 19,
        sceneId: "random-4",
        sceneKind: "random-cut",
        column: "left",
        text: "Tiempo",
    })
    const center = resolveOpeningTypography({
        seed: 19,
        sceneId: "random-4",
        sceneKind: "random-cut",
        column: "center",
        text: "y",
    })
    const right = resolveOpeningTypography({
        seed: 19,
        sceneId: "random-4",
        sceneKind: "random-cut",
        column: "right",
        text: "Vida",
    })

    assert.equal(typeof left.styleGroup, "string")
    assert.equal(left.styleGroup, center.styleGroup)
    assert.equal(center.styleGroup, right.styleGroup)
})

test("routes kana text to the japanese pool and han text to the shared cjk pool", async () => {
    const { OPENING_FONT_POOL_FAMILIES, resolveOpeningTypography } = await loadOpeningFontsModule()

    const kana = resolveOpeningTypography({
        seed: 5,
        sceneId: "random-7",
        sceneKind: "random-cut",
        column: "left",
        text: "じかん",
    })
    const han = resolveOpeningTypography({
        seed: 5,
        sceneId: "random-8",
        sceneKind: "random-cut",
        column: "right",
        text: "時間",
    })

    assert.ok(OPENING_FONT_POOL_FAMILIES.japanese.includes(kana.primaryFontFamily))
    assert.ok(OPENING_FONT_POOL_FAMILIES.cjk.includes(han.primaryFontFamily))
})

test("lets the center column share the scene style-group pool while keeping conservative styling", async () => {
    const { OPENING_FONT_POOL_FAMILIES, resolveOpeningTypography } = await loadOpeningFontsModule()

    const center = resolveOpeningTypography({
        seed: 23,
        sceneId: "random-expressive",
        sceneKind: "random-cut",
        column: "center",
        text: "jiān",
    })

    assert.ok(OPENING_FONT_POOL_FAMILIES.latin.includes(center.primaryFontFamily))
    assert.ok(center.fontWeight <= 600)
    assert.equal(center.fontStyle, "normal")
})

test("keeps center und out of IBM Plex Sans", async () => {
    const { resolveOpeningTypography } = await loadOpeningFontsModule()

    const und = resolveOpeningTypography({
        seed: 1,
        sceneId: "random-und",
        sceneKind: "random-cut",
        column: "center",
        text: "und",
    })

    assert.notEqual(und.primaryFontFamily, "IBM Plex Sans")
})

test("lets han text randomly reach Zhi Mang Xing across columns", async () => {
    const { resolveOpeningTypography } = await loadOpeningFontsModule()

    const variants = [
        ...Array.from({ length: 24 }, (_, index) =>
            resolveOpeningTypography({
                seed: index + 1,
                sceneId: "random-left-han",
                sceneKind: "random-cut",
                column: "left",
                text: "時間",
            })
        ),
        ...Array.from({ length: 24 }, (_, index) =>
            resolveOpeningTypography({
                seed: index + 1,
                sceneId: "random-center-han",
                sceneKind: "random-cut",
                column: "center",
                text: "和",
            })
        ),
        ...Array.from({ length: 24 }, (_, index) =>
            resolveOpeningTypography({
                seed: index + 1,
                sceneId: "random-right-han",
                sceneKind: "random-cut",
                column: "right",
                text: "人生",
            })
        ),
    ]

    assert.ok(variants.some((variant) => variant.primaryFontFamily === "Zhi Mang Xing"))
    assert.ok(variants.some((variant) => variant.primaryFontFamily !== "Zhi Mang Xing"))
})

test("downgrades high-risk latin text with diacritics to the safe pool", async () => {
    const { OPENING_SAFE_LATIN_FONT_FAMILIES, resolveOpeningTypography } = await loadOpeningFontsModule()

    const risky = resolveOpeningTypography({
        seed: 29,
        sceneId: "random-risky",
        sceneKind: "random-cut",
        column: "left",
        text: "shí jiān",
    })

    assert.ok(OPENING_SAFE_LATIN_FONT_FAMILIES.includes(risky.primaryFontFamily))
    assert.equal(risky.fontStyle, "normal")
    assert.ok(risky.fontWeight <= 600)
})

test("unlocks italic and weight variation for middle latin text", async () => {
    const { resolveOpeningTypography } = await loadOpeningFontsModule()

    const variants = Array.from({ length: 24 }, (_, index) =>
        resolveOpeningTypography({
            seed: index + 1,
            sceneId: "random-latin",
            sceneKind: "random-cut",
            column: "right",
            text: "Vida",
        })
    )

    assert.ok(variants.some((variant) => variant.fontStyle === "italic"))
    assert.ok(new Set(variants.map((variant) => variant.fontWeight)).size >= 2)
})
