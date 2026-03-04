/**
 * [INPUT]: 依赖 node:test/node:assert 与 pages/registry/effective-layout-tier
 * [OUTPUT]: 抽屉开关驱动的有效布局层级判定矩阵单元测试（含 mid 中间态）
 * [POS]: tests/ 的布局策略护栏，确保 `1024~1314 + 侧栏打开 => mid` 规则稳定
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { test } from "node:test"
import assert from "node:assert/strict"
import { resolveEffectiveLayoutTier } from "../src/pages/registry/effective-layout-tier.js"

test("returns mid at 1314 when sidebar is open", () => {
    const tier = resolveEffectiveLayoutTier({ viewportWidth: 1314, sidebarOpen: true })
    assert.equal(tier, "mid")
})

test("returns lg at 1315 when sidebar is open", () => {
    const tier = resolveEffectiveLayoutTier({ viewportWidth: 1315, sidebarOpen: true })
    assert.equal(tier, "lg")
})

test("returns lg at 1200 when sidebar is closed", () => {
    const tier = resolveEffectiveLayoutTier({ viewportWidth: 1200, sidebarOpen: false })
    assert.equal(tier, "lg")
})

test("returns lg at 1024 when sidebar is closed", () => {
    const tier = resolveEffectiveLayoutTier({ viewportWidth: 1024, sidebarOpen: false })
    assert.equal(tier, "lg")
})

test("returns mid at 1024 when sidebar is open", () => {
    const tier = resolveEffectiveLayoutTier({ viewportWidth: 1024, sidebarOpen: true })
    assert.equal(tier, "mid")
})

test("keeps md for 900 regardless of sidebar state", () => {
    const openTier = resolveEffectiveLayoutTier({ viewportWidth: 900, sidebarOpen: true })
    const closedTier = resolveEffectiveLayoutTier({ viewportWidth: 900, sidebarOpen: false })
    assert.equal(openTier, "md")
    assert.equal(closedTier, "md")
})

test("keeps mobile for widths below md", () => {
    const tier = resolveEffectiveLayoutTier({ viewportWidth: 767, sidebarOpen: true })
    assert.equal(tier, "mobile")
})
