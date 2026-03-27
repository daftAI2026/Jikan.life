/**
 * [INPUT]: 依赖 node:test, node:assert/strict, shared/palettes, tests/helpers/source-test-helpers
 * [OUTPUT]: random preset 语义与随机入口 UI 护栏测试
 * [POS]: tests/ 颜色预设行为护栏，锁定 preset-8 的随机语义、随机色生成器接入与黑色 Shuffle 入口
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { test } from "node:test"
import assert from "node:assert/strict"

import { PALETTE_PRESETS } from "../shared/palettes.js"
import { generateRandomPalette, getContrastRatio } from "../shared/random-palette.js"
import { assertNamedImports, readSource } from "./helpers/source-test-helpers.js"

test("palette presets reserve preset-8 as a random entry", () => {
    const randomPreset = PALETTE_PRESETS.find((preset) => preset.id === "preset-8")

    assert.ok(randomPreset, "Expected preset-8 to exist")
    assert.equal(randomPreset.name, "预设 8")
    assert.equal(randomPreset.kind, "random")
})

test("workspace hook carries a random preset candidate and generator action", () => {
    const source = readSource("src/pages/registry/sections/workspace/useHomeWallpaperConfig.js")

    assertNamedImports(source, "../../../../../shared/random-palette", ["generateRandomPalette"])
    assert.match(source, /const \[randomPaletteCandidate,\s*setRandomPaletteCandidate\] = useState\(\(\) => generateRandomPalette\(\)\)/)
    assert.match(source, /const palettePresets = useMemo\(\(\) => mapPalettePresets\(PALETTE_PRESETS,\s*normalizeHexColor,\s*randomPaletteCandidate\), \[randomPaletteCandidate\]\)/)
    assert.match(source, /function applyRandomPalette\(\)/)
    assert.match(source, /const nextPalette = generateRandomPalette\(\)/)
    assert.match(source, /setRandomPaletteCandidate\(nextPalette\)/)
    assert.match(source, /actions\.applyPalette\(nextPalette\.bg,\s*nextPalette\.accent\)/)
    assert.match(source, /applyRandomPalette,/)
})

test("random palette generator emits readable background and accent pairs", () => {
    for (let index = 0; index < 12; index += 1) {
        const palette = generateRandomPalette()

        assert.match(palette.bg, /^#[0-9A-F]{6}$/)
        assert.match(palette.accent, /^#[0-9A-F]{6}$/)
        assert.ok(getContrastRatio(palette.bg, palette.accent) >= 4.5)
    }
})

test("colors card renders preset-8 as a black Shuffle icon instead of two swatches", () => {
    const source = readSource("src/pages/registry/sections/workspace/cards/colors-card.jsx")

    assertNamedImports(source, "@phosphor-icons/react", ["Shuffle"])
    assert.match(source, /preset\.kind === "random"/)
    assert.match(source, /aria-label=\{preset\.kind === "random" \? t\("config\.randomPreset"\) : undefined\}/)
    assert.match(source, /title=\{preset\.kind === "random" \? t\("config\.randomPreset"\) : undefined\}/)
    assert.match(source, /color="var\(--color-black\)"/)
    assert.match(source, /size=\{20\}/)
    assert.match(source, /<Shuffle/)
    assert.doesNotMatch(source, /linearGradient/)
})

test("i18n exposes random preset accessibility copy", () => {
    const source = readSource("src/data/i18n.js")

    assert.match(source, /'config\.randomPreset': 'Random preset'/)
    assert.match(source, /'config\.randomPreset': '随机预设'/)
    assert.match(source, /'config\.randomPreset': '隨機預設'/)
    assert.match(source, /'config\.randomPreset': 'ランダムプリセット'/)
})
