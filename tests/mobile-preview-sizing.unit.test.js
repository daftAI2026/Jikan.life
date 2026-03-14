/**
 * [INPUT]: 依赖 node:test/node:assert 与 workspace/mobile-preview-sizing
 * [OUTPUT]: 向 `node --test` 注册移动端预览高度约束单测，覆盖 iPhone SE / 12 / 14 Pro Max 的首屏预算
 * [POS]: tests/ 的移动端预览尺寸护栏，锁定“预览优先但首卡可见”的高度算法真相源
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { test } from "node:test"
import assert from "node:assert/strict"
import {
    DEFAULT_LOCK_SCREEN_TARGET_HEIGHT,
    resolveMobilePreviewTargetHeight,
    resolvePreviewTargetHeight,
} from "../src/pages/registry/sections/workspace/mobile-preview-sizing.js"

test("keeps default lock screen target height for non-mobile layouts", () => {
    assert.equal(
        resolvePreviewTargetHeight({ effectiveLayoutTier: "lg", workspaceHeight: 900 }),
        DEFAULT_LOCK_SCREEN_TARGET_HEIGHT
    )
    assert.equal(
        resolvePreviewTargetHeight({ effectiveLayoutTier: "mid", workspaceHeight: 720 }),
        DEFAULT_LOCK_SCREEN_TARGET_HEIGHT
    )
    assert.equal(
        resolvePreviewTargetHeight({ effectiveLayoutTier: "md", workspaceHeight: 616 }),
        DEFAULT_LOCK_SCREEN_TARGET_HEIGHT
    )
})

test("shrinks mobile preview target height below desktop default", () => {
    const seHeight = resolveMobilePreviewTargetHeight({ workspaceHeight: 520 })
    const iphone12Height = resolveMobilePreviewTargetHeight({ workspaceHeight: 616 })
    const iphone14ProMaxHeight = resolveMobilePreviewTargetHeight({ workspaceHeight: 692 })

    assert.equal(seHeight, 182)
    assert.equal(iphone12Height, 273)
    assert.equal(iphone14ProMaxHeight, 345)
    assert.ok(seHeight < DEFAULT_LOCK_SCREEN_TARGET_HEIGHT)
    assert.ok(iphone12Height < DEFAULT_LOCK_SCREEN_TARGET_HEIGHT)
    assert.ok(iphone14ProMaxHeight < DEFAULT_LOCK_SCREEN_TARGET_HEIGHT)
})

test("keeps mobile preview target height monotonic across iPhone heights", () => {
    const seHeight = resolveMobilePreviewTargetHeight({ workspaceHeight: 520 })
    const iphone12Height = resolveMobilePreviewTargetHeight({ workspaceHeight: 616 })
    const iphone14ProMaxHeight = resolveMobilePreviewTargetHeight({ workspaceHeight: 692 })

    assert.ok(seHeight < iphone12Height, "SE should use a smaller preview than iPhone 12")
    assert.ok(iphone12Height < iphone14ProMaxHeight, "iPhone 12 should use a smaller preview than 14 Pro Max")
})

test("derives mobile preview budget from first-card and tabs hard constraints", () => {
    const seHeight = resolveMobilePreviewTargetHeight({ workspaceHeight: 520 })
    const iphone12Height = resolveMobilePreviewTargetHeight({ workspaceHeight: 616 })
    const iphone14ProMaxHeight = resolveMobilePreviewTargetHeight({ workspaceHeight: 692 })

    assert.equal(seHeight, Math.floor((520 - (220 + 48) - 60) * 874 / 920))
    assert.equal(iphone12Height, Math.floor((616 - (220 + 48) - 60) * 874 / 920))
    assert.equal(iphone14ProMaxHeight, Math.floor((692 - (220 + 48) - 60) * 874 / 920))
})

test("resolvePreviewTargetHeight routes mobile through the shared sizing helper", () => {
    assert.equal(
        resolvePreviewTargetHeight({ effectiveLayoutTier: "mobile", workspaceHeight: 520 }),
        resolveMobilePreviewTargetHeight({ workspaceHeight: 520 })
    )
})
