/**
 * [INPUT]: 依赖 node:test/node:assert 与 tests/helpers/source-test-helpers 的源码/配置读取能力
 * [OUTPUT]: 首页开场 overlay 行为护栏，锁定 App 接入点、Remotion Player 依赖与自动退场语义
 * [POS]: tests/ 的首页开场动画护栏，防止 Remotion 片头从首页壳层脱落或回退成不可播放实现
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { test } from "node:test"
import assert from "node:assert/strict"
import { fs, path, readJson, readSource } from "./helpers/source-test-helpers.js"

test("package.json keeps the homepage intro remotion runtime as direct dependencies", () => {
    const packageJson = readJson("package.json")

    assert.equal(packageJson.dependencies["@remotion/player"], "4.0.438")
    assert.equal(packageJson.dependencies["@remotion/google-fonts"], "4.0.438")
    assert.equal(packageJson.dependencies.remotion, "4.0.438")
})

test("App mounts the homepage intro overlay before HomePage on the root route", () => {
    const source = readSource("src/App.jsx")

    assert.match(source, /OpeningIntroOverlay/)
    assert.match(source, /function HomeRouteShell\(\)/)
    assert.match(source, /<OpeningIntroOverlay\s*\/>/)
    assert.match(source, /<HomePage\s*\/>/)
    assert.match(source, /path=["']\/["']\s+element=\{<HomeRouteShell\s*\/>\}/)
})

test("OpeningIntroOverlay embeds a fixed autoplay Remotion player and dismisses after ended", () => {
    const componentPath = path.join(process.cwd(), "src/components/OpeningIntroOverlay.jsx")

    assert.equal(fs.existsSync(componentPath), true)

    const source = fs.readFileSync(componentPath, "utf8")

    assert.match(source, /@remotion\/player/)
    assert.match(source, /OpeningTextComposition/)
    assert.match(source, /OPENING_DURATION_IN_FRAMES/)
    assert.match(source, /position:\s*"fixed"/)
    assert.match(source, /autoPlay/)
    assert.match(source, /controls=\{false\}/)
    assert.match(source, /loop=\{false\}/)
    assert.match(source, /OPENING_WIDTH/)
    assert.match(source, /OPENING_HEIGHT/)
    assert.match(source, /const OVERLAY_VIEWPORT_SCALE = 80/)
    assert.match(source, /const OVERLAY_VIEWPORT_SIZE = `min\(\$\{OVERLAY_VIEWPORT_SCALE\}vw, \$\{OVERLAY_VIEWPORT_SCALE\}vh\)`/)
    assert.match(source, /compositionWidth=\{OPENING_WIDTH\}/)
    assert.match(source, /compositionHeight=\{OPENING_HEIGHT\}/)
    assert.match(source, /width:\s*OVERLAY_VIEWPORT_SIZE/)
    assert.match(source, /height:\s*OVERLAY_VIEWPORT_SIZE/)
    assert.match(source, /display:\s*"flex"/)
    assert.match(source, /alignItems:\s*"center"/)
    assert.match(source, /justifyContent:\s*"center"/)
    assert.doesNotMatch(source, /window\.innerWidth/)
    assert.doesNotMatch(source, /window\.innerHeight/)
    assert.doesNotMatch(source, /viewportSize/)
    assert.doesNotMatch(source, /resolveIntroLayoutScale/)
    assert.match(source, /inputProps=\{\{ theme \}\}/)
    assert.doesNotMatch(source, /fadeOut:\s*false/)
    assert.doesNotMatch(source, /debugLayout:\s*true/)
    assert.match(source, /addEventListener\("ended"/)
    assert.match(source, /setPlaybackState\("exiting"\)/)
    assert.match(source, /const shouldRenderPlayer = playbackState === "playing"/)
    assert.match(source, /shouldRenderPlayer \? \(/)
})

test("OpeningTextComposition projects lane boundaries against the full stage width", () => {
    const source = readSource("remotion/OpeningTextComposition.jsx")

    assert.match(source, /fadeOut:\s*z\.boolean\(\)\.default\(true\)/)
    assert.match(source, /debugLayout:\s*z\.boolean\(\)\.default\(false\)/)
    assert.match(source, /var\(--color-kumo-base,\s*#efe7da\)/)
    assert.match(source, /var\(--color-kumo-base,\s*#090b0d\)/)
    assert.match(source, /var\(--text-color-kumo-default,\s*#13110d\)/)
    assert.match(source, /var\(--text-color-kumo-default,\s*#f4f0e8\)/)
    assert.match(source, /const DEBUG_STROKE_COLOR = "rgba\(255,\s*0,\s*0,\s*0\.9\)"/)
    assert.match(source, /const DEBUG_STROKE_WIDTH = 1/)
    assert.doesNotMatch(source, /layoutScale/)
    assert.doesNotMatch(source, /ANIMATION_AREA_WIDTH_RATIO/)
    assert.doesNotMatch(source, /animationAreaWidth/)
    assert.match(source, /const stageWidth = width/)
    assert.match(source, /const stageHeight = height/)
    assert.match(source, /const layoutCenterText = scene\.singleLine \? "" : scene\.center \?\? renderedPhrase\.center/)
    assert.match(source, /lineText:\s*renderedPhrase\.lineText \?\? ""/)
    assert.match(source, /width:\s*stageWidth/)
    assert.match(source, /width: stageWidth/)
    assert.match(source, /height: stageHeight/)
    assert.match(source, /transform: "translate\(-50%, -50%\)"/)
    assert.match(source, /transformOrigin:\s*"center center"/)
    assert.match(source, /const overlayOpacity = fadeOut \? 1 - fadeProgress : 1/)
    assert.match(source, /width:\s*stageWidth,\s*\n\s*leftText: layoutLeftText,/)
    assert.match(source, /width: textMetrics\.centerReserve/)
    assert.match(source, /left: textMetrics\.centerLeftEdge/)
    assert.match(source, /transform: "translateY\(-50%\)"/)
    assert.match(source, /left: textMetrics\.leftLaneLeftEdge/)
    assert.match(source, /left: textMetrics\.rightLaneLeftEdge/)
    assert.match(source, /border:\s*`\$\{DEBUG_STROKE_WIDTH\}px solid \$\{DEBUG_STROKE_COLOR\}`/)
    assert.match(source, /debugLayout \? \(/)
})

test("Remotion studio keeps OpeningTextAnimation on a 1:1 square composition", () => {
    const rootSource = readSource("remotion/Root.jsx")
    const timelineSource = readSource("remotion/opening-timeline.js")

    assert.match(rootSource, /width=\{OPENING_WIDTH\}/)
    assert.match(rootSource, /height=\{OPENING_HEIGHT\}/)
    assert.match(rootSource, /defaultProps=\{\{\s*theme:\s*"light",\s*debugLayout:\s*true\s*\}\}/)
    assert.match(timelineSource, /export const OPENING_WIDTH = 1080/)
    assert.match(timelineSource, /export const OPENING_HEIGHT = 1080/)
})
