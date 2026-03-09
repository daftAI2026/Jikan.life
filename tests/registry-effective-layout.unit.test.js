/**
 * [INPUT]: 依赖 node:test/node:assert 与 pages/registry/effective-layout-tier
 * [OUTPUT]: 抽屉开关驱动的布局 helper 判定矩阵单元测试（真实 tier + desktop shell + segmented workspace）
 * [POS]: tests/ 的布局策略护栏，确保 `1024~1314 + 侧栏打开 => mid`、`md + 抽屉关闭 => desktop shell` 与 `mobile/md-open => segmented workspace` 规则稳定
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { test } from "node:test"
import assert from "node:assert/strict"
import {
    resolveEffectiveLayoutTier,
    shouldUseDesktopWorkspaceShell,
    shouldUseSegmentedWorkspace,
} from "../src/pages/registry/effective-layout-tier.js"

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

test("does not change real layout tier for md widths when sidebar closes", () => {
    const tier = resolveEffectiveLayoutTier({ viewportWidth: 900, sidebarOpen: false })
    assert.equal(tier, "md")
})

test("keeps md sidebar open outside desktop shell", () => {
    const effectiveLayoutTier = resolveEffectiveLayoutTier({ viewportWidth: 900, sidebarOpen: true })
    const useDesktopShell = shouldUseDesktopWorkspaceShell({ effectiveLayoutTier, sidebarOpen: true })

    assert.equal(effectiveLayoutTier, "md")
    assert.equal(useDesktopShell, false)
})

test("routes md closed state to desktop shell without changing real layout tier", () => {
    const effectiveLayoutTier = resolveEffectiveLayoutTier({ viewportWidth: 900, sidebarOpen: false })
    const useDesktopShell = shouldUseDesktopWorkspaceShell({ effectiveLayoutTier, sidebarOpen: false })

    assert.equal(effectiveLayoutTier, "md")
    assert.equal(useDesktopShell, true)
})

test("keeps open 1024 sidebar state on desktop shell", () => {
    const effectiveLayoutTier = resolveEffectiveLayoutTier({ viewportWidth: 1024, sidebarOpen: true })
    const useDesktopShell = shouldUseDesktopWorkspaceShell({ effectiveLayoutTier, sidebarOpen: true })

    assert.equal(effectiveLayoutTier, "mid")
    assert.equal(useDesktopShell, true)
})

test("keeps lg desktop shell for closed wide desktop widths", () => {
    const effectiveLayoutTier = resolveEffectiveLayoutTier({ viewportWidth: 1200, sidebarOpen: false })
    const useDesktopShell = shouldUseDesktopWorkspaceShell({ effectiveLayoutTier, sidebarOpen: false })

    assert.equal(effectiveLayoutTier, "lg")
    assert.equal(useDesktopShell, true)
})

test("routes mobile into segmented workspace", () => {
    assert.equal(
        shouldUseSegmentedWorkspace({ effectiveLayoutTier: "mobile", sidebarOpen: false }),
        true
    )
})

test("routes md drawer-open state into segmented workspace", () => {
    assert.equal(
        shouldUseSegmentedWorkspace({ effectiveLayoutTier: "md", sidebarOpen: true }),
        true
    )
})

test("keeps md drawer-closed state out of segmented workspace", () => {
    assert.equal(
        shouldUseSegmentedWorkspace({ effectiveLayoutTier: "md", sidebarOpen: false }),
        false
    )
})

test("keeps desktop shells out of segmented workspace", () => {
    assert.equal(
        shouldUseSegmentedWorkspace({ effectiveLayoutTier: "mid", sidebarOpen: true }),
        false
    )
    assert.equal(
        shouldUseSegmentedWorkspace({ effectiveLayoutTier: "lg", sidebarOpen: false }),
        false
    )
})
