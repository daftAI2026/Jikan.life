import test from "node:test"
import assert from "node:assert/strict"

import { createLockScreenAccentOverlayColors } from "../src/pages/registry/sections/workspace/lock-screen-overlay/lock-screen-overlay.colors.js"

test("Lock screen overlay accent colors map time date and widget fg to accent", () => {
  const colors = createLockScreenAccentOverlayColors("#AABBCC")

  assert.equal(colors["time-shape"], "#AABBCC")
  assert.equal(colors["date-text"], "#AABBCC")
  assert.equal(colors["widgets-complication-1-fg"], "#AABBCC")
  assert.equal(colors["widgets-complication-4-fg"], "#AABBCC")
})

test("Lock screen overlay accent colors derive widget bg from accent alpha", () => {
  const colors = createLockScreenAccentOverlayColors("#AABBCC")

  assert.equal(colors["widgets-complication-1-bg"], "rgba(170, 187, 204, 0.15)")
  assert.equal(colors["widgets-complication-4-bg"], "rgba(170, 187, 204, 0.15)")
})

test("Lock screen overlay accent colors do not override top status time", () => {
  const colors = createLockScreenAccentOverlayColors("#AABBCC")

  assert.equal(colors["status-bar-leading"], undefined)
})
