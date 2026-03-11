import test from "node:test"
import assert from "node:assert/strict"

import {
  createLockScreenAccentOverlayColors,
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

test("Lock screen overlay top colors use inverse token on dark backgrounds", () => {
  const colors = createLockScreenTopOverlayColors("#111111")

  assert.equal(colors["home-indicator"], "var(--text-color-kumo-inverse)")
  assert.equal(colors["status-bar-leading"], "var(--text-color-kumo-inverse)")
  assert.equal(colors["status-bar-trailing"], "var(--text-color-kumo-inverse)")
  assert.equal(colors.battery, "var(--text-color-kumo-inverse)")
  assert.equal(colors.wifi, "var(--text-color-kumo-inverse)")
  assert.equal(colors.cellular, "var(--text-color-kumo-inverse)")
})

test("Lock screen overlay swipe indicator converges to the measured light neutral tone", () => {
  const colors = createLockScreenTopOverlayColors("#FFFFFF")

  assertHexClose(colors["swipe-indicator"], "#CDD1CC")
  assert.equal(colors["status-bar-leading"], "var(--text-color-kumo-default)")
  assert.equal(colors["home-indicator"], "var(--text-color-kumo-default)")
})

test("Lock screen overlay swipe indicator converges to the measured dark neutral tone", () => {
  const colors = createLockScreenTopOverlayColors("#000000")

  assertHexClose(colors["swipe-indicator"], "#404040")
  assert.equal(colors["status-bar-leading"], "var(--text-color-kumo-inverse)")
  assert.equal(colors["home-indicator"], "var(--text-color-kumo-inverse)")
})

test("Lock screen overlay swipe indicator keeps hue while softening a colored background", () => {
  const colors = createLockScreenTopOverlayColors("#86261F")

  assertHexClose(colors["swipe-indicator"], "#C2605D", 4)
  assert.equal(colors["status-bar-leading"], "var(--text-color-kumo-inverse)")
  assert.equal(colors["home-indicator"], "var(--text-color-kumo-inverse)")
})

test("Lock screen overlay top colors use default token on light backgrounds", () => {
  const colors = createLockScreenTopOverlayColors("#F5F5F5")

  assert.equal(colors["home-indicator"], "var(--text-color-kumo-default)")
  assert.equal(colors["status-bar-leading"], "var(--text-color-kumo-default)")
  assert.equal(colors["status-bar-trailing"], "var(--text-color-kumo-default)")
  assert.equal(colors.battery, "var(--text-color-kumo-default)")
  assert.equal(colors.wifi, "var(--text-color-kumo-default)")
  assert.equal(colors.cellular, "var(--text-color-kumo-default)")
})
