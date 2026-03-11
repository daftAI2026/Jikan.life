import test from "node:test"
import assert from "node:assert/strict"

import {
  createLockScreenAccentOverlayColors,
  createLockScreenActionGlassMaterial,
  createLockScreenTopOverlayColors,
} from "../src/pages/registry/sections/workspace/lock-screen-overlay/lock-screen-overlay.colors.js"

function parseHexColor(hex) {
  const normalized = hex.trim().replace("#", "")
  return [
    Number.parseInt(normalized.slice(0, 2), 16),
    Number.parseInt(normalized.slice(2, 4), 16),
    Number.parseInt(normalized.slice(4, 6), 16),
  ]
}

function assertHexClose(actual, expected, tolerance = 0) {
  assert.match(actual, /^#[0-9A-F]{6}$/)

  const actualChannels = parseHexColor(actual)
  const expectedChannels = parseHexColor(expected)
  actualChannels.forEach((channel, index) => {
    assert.ok(
      Math.abs(channel - expectedChannels[index]) <= tolerance,
      `Expected ${actual} to be within ${tolerance} of ${expected}`
    )
  })
}

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

test("Lock screen overlay top colors use pure white on dark backgrounds", () => {
  const colors = createLockScreenTopOverlayColors("#111111")

  assert.equal(colors["home-indicator"], "var(--color-white)")
  assert.equal(colors["action-left-icon"], "var(--color-white)")
  assert.equal(colors["action-right-icon"], "var(--color-white)")
  assert.equal(colors["status-bar-leading"], "var(--color-white)")
  assert.equal(colors["status-bar-trailing"], "var(--color-white)")
  assert.equal(colors.battery, "var(--color-white)")
  assert.equal(colors.wifi, "var(--color-white)")
  assert.equal(colors.cellular, "var(--color-white)")
})

test("Lock screen overlay swipe indicator converges to the measured light neutral tone", () => {
  const colors = createLockScreenTopOverlayColors("#FFFFFF")

  assertHexClose(colors["swipe-indicator"], "#CDD1CC")
  assert.equal(colors["action-left-icon"], "var(--color-black)")
  assert.equal(colors["action-right-icon"], "var(--color-black)")
  assert.equal(colors["status-bar-leading"], "var(--color-black)")
  assert.equal(colors["home-indicator"], "var(--color-black)")
})

test("Lock screen overlay swipe indicator converges to the measured dark neutral tone", () => {
  const colors = createLockScreenTopOverlayColors("#000000")

  assertHexClose(colors["swipe-indicator"], "#404040")
  assert.equal(colors["action-left-icon"], "var(--color-white)")
  assert.equal(colors["action-right-icon"], "var(--color-white)")
  assert.equal(colors["status-bar-leading"], "var(--color-white)")
  assert.equal(colors["home-indicator"], "var(--color-white)")
})

test("Lock screen overlay swipe indicator keeps hue while softening a colored background", () => {
  const colors = createLockScreenTopOverlayColors("#86261F")

  assertHexClose(colors["swipe-indicator"], "#C2605D", 4)
  assert.equal(colors["action-left-icon"], "var(--color-white)")
  assert.equal(colors["action-right-icon"], "var(--color-white)")
  assert.equal(colors["status-bar-leading"], "var(--color-white)")
  assert.equal(colors["home-indicator"], "var(--color-white)")
})

test("Lock screen overlay top colors use pure black on light backgrounds", () => {
  const colors = createLockScreenTopOverlayColors("#F5F5F5")

  assert.equal(colors["home-indicator"], "var(--color-black)")
  assert.equal(colors["action-left-icon"], "var(--color-black)")
  assert.equal(colors["action-right-icon"], "var(--color-black)")
  assert.equal(colors["status-bar-leading"], "var(--color-black)")
  assert.equal(colors["status-bar-trailing"], "var(--color-black)")
  assert.equal(colors.battery, "var(--color-black)")
  assert.equal(colors.wifi, "var(--color-black)")
  assert.equal(colors.cellular, "var(--color-black)")
})

test("Lock screen action glass material brightens on dark backgrounds", () => {
  const material = createLockScreenActionGlassMaterial("#111111")

  assert.equal(material.blur, "blur(6px)")
  assert.match(material.background, /^rgba\(255, 255, 255, 0\.\d+\)$/)
  assert.equal(material.background, "rgba(255, 255, 255, 0.02)")
  assert.equal(material.borderColor, "rgba(255, 255, 255, 0.3)")
  assert.equal(material.topHighlightColor, "rgba(255, 255, 255, 0.8)")
  assert.equal(material.leftHighlightColor, "rgba(255, 255, 255, 0.8)")
  assert.match(material.innerGlowShadow, /^inset /)
})

test("Lock screen action glass material softens on light backgrounds", () => {
  const material = createLockScreenActionGlassMaterial("#F5F5F5")

  assert.equal(material.background, "rgba(255, 255, 255, 0.09)")
  assert.equal(material.borderColor, "rgba(255, 255, 255, 0.26)")
  assert.equal(material.topHighlightColor, "rgba(255, 255, 255, 0.72)")
  assert.equal(material.leftHighlightColor, "rgba(255, 255, 255, 0.72)")
})

test("Lock screen action glass material keeps medium intensity on colored backgrounds", () => {
  const material = createLockScreenActionGlassMaterial("#86261F")

  assert.equal(material.background, "rgba(255, 255, 255, 0.06)")
  assert.equal(material.borderColor, "rgba(255, 255, 255, 0.3)")
  assert.equal(material.topHighlightColor, "rgba(255, 255, 255, 0.8)")
  assert.equal(material.leftHighlightColor, "rgba(255, 255, 255, 0.8)")
  assert.match(
    material.innerGlowShadow,
    /inset 0 1px 0 rgba\(255, 255, 255, 0\.5\), inset 0 -1px 0 rgba\(255, 255, 255, 0\.1\), inset 0 0 0 0 rgba\(255, 255, 255, 0\)/
  )
})
