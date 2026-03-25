/**
 * [INPUT]: 依赖 node:test/node:assert、tests/helpers/source-test-helpers，以及 data/i18n、device-visibility 真相源
 * [OUTPUT]: 向 `node --test` 注册首页 SEO 护栏用例，锁定 index.html 最小离屏语义、JSON-LD、字体加载策略、sitemap 单 URL 与事实一致性
 * [POS]: tests/ 的首页 SEO 回归护栏，防止最小离屏语义、结构化数据和单一真相源发生漂移
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { test } from "node:test"
import assert from "node:assert/strict"
import { readSource } from "./helpers/source-test-helpers.js"
import { i18nData, SUPPORTED_LANGS } from "../src/data/i18n.js"
import { PRIMARY_VISIBLE_DEVICE_CATEGORY, VISIBLE_DEVICE_CATEGORIES } from "../src/pages/registry/sections/workspace/device-visibility.js"

function readIndexHtml() {
  return readSource("index.html")
}

function readSitemapXml() {
  return readSource("public/sitemap.xml")
}

function getJsonLdBlocks(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) =>
    JSON.parse(match[1].trim())
  )
}

test("index.html exposes a minimal crawlable homepage semantic layer inside root", () => {
  const html = readIndexHtml()
  const rootMatch = html.match(/<div id="root">([\s\S]*?)<\/div>/)

  assert.ok(rootMatch, "expected #root markup inside index.html")

  const rootHtml = rootMatch[1]
  const h1Matches = rootHtml.match(/<h1\b/g) ?? []

  assert.equal(h1Matches.length, 1)
  assert.match(rootHtml, /data-seo-skeleton="home"/)
  assert.match(rootHtml, /aria-hidden="true"/)
  assert.match(rootHtml, /position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect\(0,0,0,0\);white-space:nowrap;border:0;/)
  assert.match(rootHtml, /<main[^>]*>/)
  assert.match(rootHtml, />Jikan Dynamic Wallpaper Generator for Year Progress and Goal Countdown<\/h1>/)
  assert.doesNotMatch(rootHtml, /<section\b/)
  assert.doesNotMatch(rootHtml, /FAQ/)
  assert.doesNotMatch(rootHtml, /How it works/)
})

test("index.html publishes canonical, non-blocking font loading, and two JSON-LD blocks", () => {
  const html = readIndexHtml()
  const jsonLdBlocks = getJsonLdBlocks(html)
  const jsonLdTypes = jsonLdBlocks.map((block) => block["@type"])
  const fontStylesheetLinks = [...html.matchAll(/<link rel="stylesheet"\s+href="https:\/\/fonts\.googleapis\.com\/css2\?[^"]+" \/>/g)]

  assert.match(html, /<link rel="canonical" href="https:\/\/jikan\.life\/" \/>/)
  assert.match(html, /<link rel="preload" as="style"\s+href="https:\/\/fonts\.googleapis\.com\/css2\?[^"]+"\s+onload="this\.onload=null;this\.rel='stylesheet'" \/>/)
  assert.match(html, /<noscript>\s*<link rel="stylesheet"\s+href="https:\/\/fonts\.googleapis\.com\/css2\?[\s\S]*?<\/noscript>/)
  assert.equal(fontStylesheetLinks.length, 1)
  assert.equal(jsonLdBlocks.length, 2)
  assert.deepEqual(jsonLdTypes, ["WebSite", "WebApplication"])
})

test("homepage SEO facts stay aligned with wallpaper, device, and language truth sources", () => {
  const html = readIndexHtml()
  const jsonLdBlocks = getJsonLdBlocks(html)
  const expectedDeviceLabel = PRIMARY_VISIBLE_DEVICE_CATEGORY
  const webApplication = jsonLdBlocks.find((block) => block["@type"] === "WebApplication")

  assert.ok(webApplication, "expected WebApplication JSON-LD")

  assert.match(html, /Year Progress wallpaper generation/)
  assert.match(html, /Goal Countdown wallpaper generation/)
  assert.match(html, new RegExp(`Currently supports ${expectedDeviceLabel}`))
  assert.deepEqual(VISIBLE_DEVICE_CATEGORIES, ["iPhone"])
  assert.deepEqual(webApplication.inLanguage, SUPPORTED_LANGS)
  assert.match(html, /Configuration is driven by URL parameters/)
  assert.doesNotMatch(html, /FAQPage/)
})

test("sitemap keeps a single public homepage URL", () => {
  const sitemap = readSitemapXml()
  const locMatches = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1])

  assert.deepEqual(locMatches, ["https://jikan.life/"])
})
