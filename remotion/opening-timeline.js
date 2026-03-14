/**
 * [INPUT]: 依赖内联多语对照表与 seed，按 doc/时间与人生:生命的多语对照扩展表 提炼首选文案
 * [OUTPUT]: 对外提供开场动画时间线常量、打字机光标规则、文案序列与逐帧解析函数
 * [POS]: remotion/ 的纯逻辑真相源，被 OpeningTextComposition 与单元测试共同消费
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

export const OPENING_FPS = 30
export const OPENING_WIDTH = 1920
export const OPENING_HEIGHT = 1080
export const INTRO_DURATION_IN_FRAMES = 48
export const INTRO_HOLD_DURATION_IN_FRAMES = 12
export const HARD_CUT_DURATION_IN_FRAMES = 15
export const OPENING_FADE_DURATION_IN_FRAMES = 24
export const TYPEWRITER_CURSOR_CHARACTER = "|"

const TYPEWRITER_CURSOR_BLINK_CYCLE_IN_FRAMES = 12

const INTRO_PHRASE = { left: "Time", center: "&", right: "Life" }
const INTRO_TOTAL_CHARACTERS = "Time & Life".length

const RAW_LANGUAGE_ROWS = [
    { label: "简体中文", left: "时间", center: "和", right: "人生" },
    { label: "繁体中文", left: "時間", center: "與", right: "人生" },
    { label: "中文拼音", left: "shí jiān", center: "&", right: "rén shēng" },
    { label: "日语 (汉字)", left: "時間", center: "与", right: "人生" },
    { label: "日语 (平假名)", left: "じかん", center: "と", right: "じんせい" },
    { label: "日语 (片假名)", left: "タイム", center: "×", right: "ライフ" },
    { label: "日语 (罗马音)", left: "jikan", center: "to", right: "jinsei" },
    { label: "英语 (English)", left: "Time", center: "& / +", right: "Life" },
    { label: "法语 (Français)", left: "Temps", center: "et", right: "Vie" },
    { label: "西班牙语 (Español)", left: "Tiempo", center: "y", right: "Vida" },
    { label: "德语 (Deutsch)", left: "Zeit", center: "und", right: "Leben" },
    { label: "拉丁语 (Latin)", left: "Tempus", center: "et", right: "Vita" },
]

const FIXED_ENDING_SCENES = [
    { kind: "ending-cut", durationInFrames: HARD_CUT_DURATION_IN_FRAMES, left: "時間", center: "与", right: "人生" },
    { kind: "ending-cut", durationInFrames: HARD_CUT_DURATION_IN_FRAMES, left: "時間", center: "と", right: "人生" },
    { kind: "ending-cut", durationInFrames: HARD_CUT_DURATION_IN_FRAMES, left: "jikan", center: "と", right: "life" },
    {
        kind: "domain-lockup",
        durationInFrames: HARD_CUT_DURATION_IN_FRAMES,
        lineText: "jikan.life",
        singleLine: true,
    },
]

function takeFirstVariant(value) {
    return value
        .split("/")
        .map((part) => part.trim())
        .filter(Boolean)[0] ?? ""
}

function normalizePhraseRow(row) {
    return {
        label: row.label,
        left: takeFirstVariant(row.left),
        center: takeFirstVariant(row.center),
        right: takeFirstVariant(row.right),
    }
}

function createSeededRandom(seed) {
    let state = (Math.trunc(seed) >>> 0) || 1

    return () => {
        state = (state + 0x6d2b79f5) >>> 0
        let mixed = Math.imul(state ^ (state >>> 15), state | 1)
        mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61)
        return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296
    }
}

function shuffleWithSeed(items, seed) {
    const random = createSeededRandom(seed)
    const nextItems = [...items]

    for (let index = nextItems.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(random() * (index + 1))
        ;[nextItems[index], nextItems[swapIndex]] = [nextItems[swapIndex], nextItems[index]]
    }

    return nextItems
}

export function buildSlowFastSlowDurations(count, totalFrames) {
    if (count <= 0) return []

    const weights = Array.from({ length: count }, (_, index) => {
        const progress = count === 1 ? 0 : index / (count - 1)
        const distanceFromCenter = Math.abs(progress - 0.5) / 0.5
        return 0.35 + 4.65 * distanceFromCenter ** 1.35
    })
    const weightSum = weights.reduce((sum, value) => sum + value, 0)
    const rawDurations = weights.map((weight) => (weight / weightSum) * totalFrames)
    const baseDurations = rawDurations.map((duration) => Math.floor(duration))
    let remainingFrames = totalFrames - baseDurations.reduce((sum, duration) => sum + duration, 0)

    const sortedRemainders = rawDurations
        .map((duration, index) => ({ index, remainder: duration - Math.floor(duration) }))
        .sort((left, right) => right.remainder - left.remainder)

    for (let index = 0; index < sortedRemainders.length && remainingFrames > 0; index += 1) {
        baseDurations[sortedRemainders[index].index] += 1
        remainingFrames -= 1
    }

    return baseDurations
}

function buildColumnCadencePlan(values, seed) {
    const shuffledValues = shuffleWithSeed(values, seed)
    const durations = buildSlowFastSlowDurations(shuffledValues.length, RANDOM_SECTION_DURATION_IN_FRAMES)

    return shuffledValues.map((value, index) => ({
        value,
        durationInFrames: durations[index],
    }))
}

function wrapLoopedFrame(frame, durationInFrames) {
    if (durationInFrames <= 0) return 0

    const wrappedFrame = frame % durationInFrames
    return wrappedFrame < 0 ? wrappedFrame + durationInFrames : wrappedFrame
}

function resolvePlanValueAtFrame(plan, frame, offsetInFrames = 0) {
    const wrappedFrame = wrapLoopedFrame(frame + offsetInFrames, RANDOM_SECTION_DURATION_IN_FRAMES)
    let cursor = 0

    for (const entry of plan) {
        const nextCursor = cursor + entry.durationInFrames
        if (wrappedFrame < nextCursor) {
            return entry.value
        }
        cursor = nextCursor
    }

    return plan[plan.length - 1]?.value
}

function resolveTypedPhrase(phrase, typedCharacters) {
    const leftCharacters = Math.min(typedCharacters, phrase.left.length)
    const remainingAfterLeft = Math.max(typedCharacters - phrase.left.length - 1, 0)
    const centerCharacters = Math.min(remainingAfterLeft, phrase.center.length)
    const remainingAfterCenter = Math.max(
        typedCharacters - phrase.left.length - 1 - phrase.center.length - 1,
        0
    )
    const rightCharacters = Math.min(remainingAfterCenter, phrase.right.length)

    return {
        left: phrase.left.slice(0, leftCharacters),
        center: phrase.center.slice(0, centerCharacters),
        right: phrase.right.slice(0, rightCharacters),
    }
}

export function resolveTypewriterCursorState(sceneKind, localFrame) {
    const visibleScene = sceneKind === "intro-typewriter" || sceneKind === "intro-hold"
    const safeLocalFrame = Math.max(0, Math.floor(localFrame))
    const blinkProgress = (safeLocalFrame % TYPEWRITER_CURSOR_BLINK_CYCLE_IN_FRAMES) / TYPEWRITER_CURSOR_BLINK_CYCLE_IN_FRAMES
    const opacity = visibleScene ? 0.3 + 0.7 * (0.5 + 0.5 * Math.cos(Math.PI * 2 * blinkProgress)) : 0

    return {
        character: TYPEWRITER_CURSOR_CHARACTER,
        visible: visibleScene,
        opacity: Number(opacity.toFixed(3)),
    }
}

export const RANDOMIZED_LANGUAGE_ROWS = RAW_LANGUAGE_ROWS
    .map(normalizePhraseRow)
    .filter((row) => row.label !== "英语 (English)")

export const RANDOM_SECTION_START_IN_FRAMES =
    INTRO_DURATION_IN_FRAMES + INTRO_HOLD_DURATION_IN_FRAMES

export const RANDOM_SECTION_DURATION_IN_FRAMES =
    RANDOMIZED_LANGUAGE_ROWS.length * HARD_CUT_DURATION_IN_FRAMES

const COLUMN_CADENCE_OFFSETS = {
    left: 0,
    center: 4,
    right: 8,
}

export const OPENING_CONTENT_DURATION_IN_FRAMES =
    INTRO_DURATION_IN_FRAMES +
    INTRO_HOLD_DURATION_IN_FRAMES +
    RANDOMIZED_LANGUAGE_ROWS.length * HARD_CUT_DURATION_IN_FRAMES +
    FIXED_ENDING_SCENES.reduce((sum, scene) => sum + scene.durationInFrames, 0)

export const OPENING_DURATION_IN_FRAMES =
    OPENING_CONTENT_DURATION_IN_FRAMES + OPENING_FADE_DURATION_IN_FRAMES

export function createOpeningPhraseSequence(seed) {
    const shuffledLeft = shuffleWithSeed(RANDOMIZED_LANGUAGE_ROWS.map((row) => row.left), seed + 11)
    const shuffledCenter = shuffleWithSeed(RANDOMIZED_LANGUAGE_ROWS.map((row) => row.center), seed + 23)
    const shuffledRight = shuffleWithSeed(RANDOMIZED_LANGUAGE_ROWS.map((row) => row.right), seed + 37)

    const randomizedScenes = RANDOMIZED_LANGUAGE_ROWS.map((row, index) => ({
        id: `random-${index}-${row.label}`,
        kind: "random-cut",
        durationInFrames: HARD_CUT_DURATION_IN_FRAMES,
        left: shuffledLeft[index],
        center: shuffledCenter[index],
        right: shuffledRight[index],
    }))

    return [
        {
            ...INTRO_PHRASE,
            id: "intro",
            kind: "intro-typewriter",
            durationInFrames: INTRO_DURATION_IN_FRAMES,
        },
        {
            ...INTRO_PHRASE,
            id: "intro-hold",
            kind: "intro-hold",
            durationInFrames: INTRO_HOLD_DURATION_IN_FRAMES,
        },
        ...randomizedScenes,
        ...FIXED_ENDING_SCENES.map((scene, index) => ({
            ...scene,
            id: `${scene.kind}-${index}`,
        })),
    ]
}

export function resolveOpeningFrameState(frame, seed) {
    const safeFrame = Math.max(0, Math.min(Math.floor(frame), OPENING_DURATION_IN_FRAMES - 1))
    const contentFrame = Math.min(safeFrame, OPENING_CONTENT_DURATION_IN_FRAMES - 1)
    const fadeProgress =
        safeFrame < OPENING_CONTENT_DURATION_IN_FRAMES
            ? 0
            : Math.min(
                  (safeFrame - OPENING_CONTENT_DURATION_IN_FRAMES + 1) / OPENING_FADE_DURATION_IN_FRAMES,
                  1
              )

    const leftCadencePlan = buildColumnCadencePlan(
        RANDOMIZED_LANGUAGE_ROWS.map((row) => row.left),
        seed + 101
    )
    const centerCadencePlan = buildColumnCadencePlan(
        RANDOMIZED_LANGUAGE_ROWS.map((row) => row.center),
        seed + 167
    )
    const rightCadencePlan = buildColumnCadencePlan(
        RANDOMIZED_LANGUAGE_ROWS.map((row) => row.right),
        seed + 211
    )
    let cursor = 0

    for (const scene of createOpeningPhraseSequence(seed)) {
        const endFrame = cursor + scene.durationInFrames

        if (contentFrame < endFrame) {
            const localFrame = contentFrame - cursor
            const randomSectionFrame = contentFrame - RANDOM_SECTION_START_IN_FRAMES
            const renderedPhrase =
                scene.kind === "intro-typewriter"
                    ? resolveTypedPhrase(
                          scene,
                          Math.ceil(((localFrame + 1) / scene.durationInFrames) * INTRO_TOTAL_CHARACTERS)
                      )
                    : scene.kind === "random-cut"
                      ? {
                            left: resolvePlanValueAtFrame(
                                leftCadencePlan,
                                randomSectionFrame,
                                COLUMN_CADENCE_OFFSETS.left
                            ),
                            center: resolvePlanValueAtFrame(
                                centerCadencePlan,
                                randomSectionFrame,
                                COLUMN_CADENCE_OFFSETS.center
                            ),
                            right: resolvePlanValueAtFrame(
                                rightCadencePlan,
                                randomSectionFrame,
                                COLUMN_CADENCE_OFFSETS.right
                            ),
                        }
                    : scene.singleLine
                      ? { left: "", center: "", right: "", lineText: scene.lineText }
                      : { left: scene.left, center: scene.center, right: scene.right }

            return {
                scene,
                localFrame,
                fadeProgress,
                renderedPhrase,
            }
        }

        cursor = endFrame
    }

    const fallbackScene = FIXED_ENDING_SCENES[FIXED_ENDING_SCENES.length - 1]

    return {
        scene: fallbackScene,
        localFrame: fallbackScene.durationInFrames - 1,
        fadeProgress: 1,
        renderedPhrase: fallbackScene.singleLine
            ? { left: "", center: "", right: "", lineText: fallbackScene.lineText }
            : { left: fallbackScene.left, center: fallbackScene.center, right: fallbackScene.right },
    }
}
