/**
 * [INPUT]: 依赖 node:test/node:assert 与 remotion/opening-timeline 的开场文案时间线纯函数
 * [OUTPUT]: 开场文字动画单元测试，锁定随机语言池筛选、总时长、打字机光标、三列错拍节奏与固定尾声顺序
 * [POS]: tests/ 的 Remotion 护栏，防止时间线、洗牌策略、打字机光标、三列节奏与最终域名停留语义漂移
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { test } from "node:test"
import assert from "node:assert/strict"

async function loadOpeningTimelineModule() {
    return import("../remotion/opening-timeline.js").catch(() => ({}))
}

test("builds a randomized pool without the duplicate English row", async () => {
    const { createOpeningPhraseSequence } = await loadOpeningTimelineModule()

    assert.equal(typeof createOpeningPhraseSequence, "function")

    const sequence = createOpeningPhraseSequence(42)
    const randomizedScenes = sequence.filter((scene) => scene.kind === "random-cut")
    const renderedRows = randomizedScenes.map((scene) => `${scene.left}|${scene.center}|${scene.right}`)

    assert.equal(randomizedScenes.length, 11)
    assert.equal(new Set(renderedRows).size, 11)
    assert.equal(renderedRows.includes("Time|&|Life"), false)
})

test("holds on Time & Life after the typewriter finishes", async () => {
    const {
        INTRO_DURATION_IN_FRAMES,
        INTRO_HOLD_DURATION_IN_FRAMES,
        createOpeningPhraseSequence,
    } = await loadOpeningTimelineModule()

    const sequence = createOpeningPhraseSequence(7)

    assert.equal(INTRO_DURATION_IN_FRAMES, 48)
    assert.equal(INTRO_HOLD_DURATION_IN_FRAMES, 12)
    assert.deepEqual(
        sequence.slice(0, 2).map((scene) => ({
            kind: scene.kind,
            durationInFrames: scene.durationInFrames,
            text: `${scene.left} ${scene.center} ${scene.right}`.trim().replace(/\s+/g, " "),
        })),
        [
            { kind: "intro-typewriter", durationInFrames: 48, text: "Time & Life" },
            { kind: "intro-hold", durationInFrames: 12, text: "Time & Life" },
        ]
    )
})

test("fades the typewriter cursor gently only during the intro typing and hold scenes", async () => {
    const { TYPEWRITER_CURSOR_CHARACTER, resolveTypewriterCursorState } = await loadOpeningTimelineModule()

    assert.equal(TYPEWRITER_CURSOR_CHARACTER, "|")
    assert.equal(typeof resolveTypewriterCursorState, "function")

    assert.deepEqual(resolveTypewriterCursorState("intro-typewriter", 0), {
        character: "|",
        visible: true,
        opacity: 1,
    })
    assert.deepEqual(resolveTypewriterCursorState("intro-typewriter", 6), {
        character: "|",
        visible: true,
        opacity: 0.3,
    })
    assert.deepEqual(resolveTypewriterCursorState("intro-hold", 2), {
        character: "|",
        visible: true,
        opacity: 0.825,
    })
    assert.deepEqual(resolveTypewriterCursorState("random-cut", 2), {
        character: "|",
        visible: false,
        opacity: 0,
    })
})

test("keeps the full opening timeline at 309 frames with a 24 frame fade", async () => {
    const {
        OPENING_CONTENT_DURATION_IN_FRAMES,
        OPENING_DURATION_IN_FRAMES,
        OPENING_FADE_DURATION_IN_FRAMES,
        createOpeningPhraseSequence,
    } = await loadOpeningTimelineModule()

    assert.equal(OPENING_CONTENT_DURATION_IN_FRAMES, 285)
    assert.equal(OPENING_FADE_DURATION_IN_FRAMES, 24)
    assert.equal(OPENING_DURATION_IN_FRAMES, 309)

    const totalSceneFrames = createOpeningPhraseSequence(7).reduce(
        (sum, scene) => sum + scene.durationInFrames,
        0
    )

    assert.equal(totalSceneFrames, OPENING_CONTENT_DURATION_IN_FRAMES)
})

test("randomized scenes mix left center and right columns independently", async () => {
    const { RANDOMIZED_LANGUAGE_ROWS, createOpeningPhraseSequence } = await loadOpeningTimelineModule()

    const groupedRows = new Set(
        RANDOMIZED_LANGUAGE_ROWS.map((scene) => `${scene.left}|${scene.center}|${scene.right}`)
    )
    const randomizedScenes = createOpeningPhraseSequence(1).filter((scene) => scene.kind === "random-cut")

    assert.equal(randomizedScenes.length, 11)
    assert.ok(
        randomizedScenes.some((scene) => !groupedRows.has(`${scene.left}|${scene.center}|${scene.right}`)),
        "Expected at least one randomized scene to break out of the original grouped language rows"
    )
})

test("shapes randomized column cadence as slow-fast-slow", async () => {
    const { RANDOMIZED_LANGUAGE_ROWS, buildSlowFastSlowDurations } = await loadOpeningTimelineModule()

    assert.equal(typeof buildSlowFastSlowDurations, "function")

    const durations = buildSlowFastSlowDurations(
        RANDOMIZED_LANGUAGE_ROWS.length,
        RANDOMIZED_LANGUAGE_ROWS.length * 15
    )

    assert.equal(durations.length, RANDOMIZED_LANGUAGE_ROWS.length)
    assert.equal(durations.reduce((sum, duration) => sum + duration, 0), RANDOMIZED_LANGUAGE_ROWS.length * 15)
    assert.ok(Math.max(...durations) >= 24)
    assert.ok(Math.min(...durations) <= 5)
    assert.ok(durations[0] > durations[Math.floor(durations.length / 2)])
    assert.ok(durations[durations.length - 1] > durations[Math.floor(durations.length / 2)])
})

test("starts offset beats early in the random section instead of waiting for the midpoint", async () => {
    const { RANDOM_SECTION_START_IN_FRAMES, resolveOpeningFrameState } = await loadOpeningTimelineModule()

    const foundEarlyOffsetBeat = Array.from({ length: 24 }, (_, index) => RANDOM_SECTION_START_IN_FRAMES + index).some(
        (frame) => {
            const current = resolveOpeningFrameState(frame, 1)
            const next = resolveOpeningFrameState(frame + 2, 1)
            const changedColumns = [
                current.renderedPhrase.left !== next.renderedPhrase.left,
                current.renderedPhrase.center !== next.renderedPhrase.center,
                current.renderedPhrase.right !== next.renderedPhrase.right,
            ]
            const changedCount = changedColumns.filter(Boolean).length

            return changedCount >= 1 && changedCount <= 2
        }
    )

    assert.equal(foundEarlyOffsetBeat, true)
})

test("creates extra left-side randomness inside at least one single center-cut window", async () => {
    const { RANDOM_SECTION_START_IN_FRAMES, RANDOMIZED_LANGUAGE_ROWS, resolveOpeningFrameState } =
        await loadOpeningTimelineModule()

    const foundWindow = Array.from({ length: RANDOMIZED_LANGUAGE_ROWS.length }, (_, index) => {
        const startFrame = RANDOM_SECTION_START_IN_FRAMES + index * 15
        const sampled = [0, 5, 10, 14].map((offset) => resolveOpeningFrameState(startFrame + offset, 1))
        const centerValues = new Set(sampled.map((state) => state.renderedPhrase.center))
        const leftValues = new Set(sampled.map((state) => state.renderedPhrase.left))
        return centerValues.size === 1 && leftValues.size > 1
    }).some(Boolean)

    assert.equal(foundWindow, true)
})

test("staggered cadence lets left center and right each lead on their own beat", async () => {
    const { RANDOM_SECTION_START_IN_FRAMES, RANDOM_SECTION_DURATION_IN_FRAMES, resolveOpeningFrameState } =
        await loadOpeningTimelineModule()

    const beatWindows = Array.from(
        { length: RANDOM_SECTION_DURATION_IN_FRAMES - 2 },
        (_, index) => RANDOM_SECTION_START_IN_FRAMES + index
    ).map((frame) => {
        const current = resolveOpeningFrameState(frame, 1)
        const next = resolveOpeningFrameState(frame + 2, 1)

        return {
            leftOnly:
                current.renderedPhrase.left !== next.renderedPhrase.left &&
                current.renderedPhrase.center === next.renderedPhrase.center &&
                current.renderedPhrase.right === next.renderedPhrase.right,
            centerOnly:
                current.renderedPhrase.left === next.renderedPhrase.left &&
                current.renderedPhrase.center !== next.renderedPhrase.center &&
                current.renderedPhrase.right === next.renderedPhrase.right,
            rightOnly:
                current.renderedPhrase.left === next.renderedPhrase.left &&
                current.renderedPhrase.center === next.renderedPhrase.center &&
                current.renderedPhrase.right !== next.renderedPhrase.right,
        }
    })

    assert.equal(beatWindows.some((window) => window.leftOnly), true)
    assert.equal(beatWindows.some((window) => window.centerOnly), true)
    assert.equal(beatWindows.some((window) => window.rightOnly), true)
})

test("pins the ending lines and collapses the final beat into one centered jikan.life line", async () => {
    const { createOpeningPhraseSequence } = await loadOpeningTimelineModule()

    assert.equal(typeof createOpeningPhraseSequence, "function")

    const sequence = createOpeningPhraseSequence(99)
    const endingScenes = sequence.slice(-4)

    assert.deepEqual(
        endingScenes.map((scene) => ({
            kind: scene.kind,
            text: scene.lineText ?? `${scene.left} ${scene.center} ${scene.right}`.trim().replace(/\s+/g, " "),
            durationInFrames: scene.durationInFrames,
            compact: scene.compact ?? false,
            ...(scene.singleLine ? { singleLine: true } : {}),
        })),
        [
            { kind: "ending-cut", text: "時間 与 人生", durationInFrames: 15, compact: false },
            { kind: "ending-cut", text: "時間 と 人生", durationInFrames: 15, compact: false },
            { kind: "ending-cut", text: "jikan と life", durationInFrames: 15, compact: false },
            { kind: "domain-lockup", text: "jikan.life", durationInFrames: 15, compact: false, singleLine: true },
        ]
    )
})
