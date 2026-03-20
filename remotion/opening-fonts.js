/**
 * [INPUT]: 依赖 @remotion/google-fonts 的在线字体加载与开场动画 scene/column/text 语义
 * [OUTPUT]: 对外提供开场字体池、风格组约束、锚点 Inter 与逐列字体解析函数
 * [POS]: remotion/ 的字体真相源，被 OpeningTextComposition 与字体单元测试共同消费
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { loadFont as loadArchivo } from "@remotion/google-fonts/Archivo"
import { loadFont as loadDotGothic16 } from "@remotion/google-fonts/DotGothic16"
import { loadFont as loadGloriaHallelujah } from "@remotion/google-fonts/GloriaHallelujah"
import { loadFont as loadIBMPlexSans } from "@remotion/google-fonts/IBMPlexSans"
import { loadFont as loadInter } from "@remotion/google-fonts/Inter"
import { loadFont as loadJetBrainsMono } from "@remotion/google-fonts/JetBrainsMono"
import { loadFont as loadNotoSansJP } from "@remotion/google-fonts/NotoSansJP"
import { loadFont as loadNotoSansSC } from "@remotion/google-fonts/NotoSansSC"
import { loadFont as loadNotoSansTC } from "@remotion/google-fonts/NotoSansTC"
import { loadFont as loadNotoSerifJP } from "@remotion/google-fonts/NotoSerifJP"
import { loadFont as loadNotoSerifSC } from "@remotion/google-fonts/NotoSerifSC"
import { loadFont as loadPlayfairDisplay } from "@remotion/google-fonts/PlayfairDisplay"
import { loadFont as loadSourceSerif4 } from "@remotion/google-fonts/SourceSerif4"
import { loadFont as loadSpaceGrotesk } from "@remotion/google-fonts/SpaceGrotesk"
import { loadFont as loadYujiBoku } from "@remotion/google-fonts/YujiBoku"
import { loadFont as loadZenKakuGothicNew } from "@remotion/google-fonts/ZenKakuGothicNew"
import { loadFont as loadZenOldMincho } from "@remotion/google-fonts/ZenOldMincho"
import { loadFont as loadZhiMangXing } from "@remotion/google-fonts/ZhiMangXing"

const GOOGLE_FONT_OPTIONS = {
    ignoreTooManyRequestsWarning: true,
}

const LATIN_SUBSETS = ["latin", "latin-ext"]

function loadLatinFont(loadFont, normalWeights, italicWeights = normalWeights) {
    const { fontFamily } = loadFont("normal", {
        ...GOOGLE_FONT_OPTIONS,
        weights: normalWeights.map(String),
        subsets: LATIN_SUBSETS,
    })
    if (italicWeights.length > 0) {
        loadFont("italic", {
            ...GOOGLE_FONT_OPTIONS,
            weights: italicWeights.map(String),
            subsets: LATIN_SUBSETS,
        })
    }
    return fontFamily
}

function loadCjkFont(loadFont, weights) {
    const { fontFamily } = loadFont("normal", {
        ...GOOGLE_FONT_OPTIONS,
        weights: weights.map(String),
    })
    return fontFamily
}

const interFamily = loadLatinFont(loadInter, [600, 700], [])
const archivoFamily = loadLatinFont(loadArchivo, [500, 600, 700])
const gloriaHallelujahFamily = loadLatinFont(loadGloriaHallelujah, [400], [])
const ibmPlexSansFamily = loadLatinFont(loadIBMPlexSans, [400, 500, 700])
const jetBrainsMonoFamily = loadLatinFont(loadJetBrainsMono, [500, 700, 800])
const playfairDisplayFamily = loadLatinFont(loadPlayfairDisplay, [400, 500, 600, 700])
const sourceSerif4Family = loadLatinFont(loadSourceSerif4, [400, 500, 600, 700])
const spaceGroteskFamily = loadLatinFont(loadSpaceGrotesk, [400, 500, 700], [])

const notoSansScFamily = loadCjkFont(loadNotoSansSC, [400, 500, 700])
const notoSerifScFamily = loadCjkFont(loadNotoSerifSC, [400, 600, 700])
const notoSansTcFamily = loadCjkFont(loadNotoSansTC, [400, 500, 700])
const notoSansJpFamily = loadCjkFont(loadNotoSansJP, [400, 500, 700])
const notoSerifJpFamily = loadCjkFont(loadNotoSerifJP, [400, 600, 700])
const zenKakuGothicNewFamily = loadCjkFont(loadZenKakuGothicNew, [400, 500, 700])
const zenOldMinchoFamily = loadCjkFont(loadZenOldMincho, [400, 700])
const dotGothic16Family = loadCjkFont(loadDotGothic16, [400])
const yujiBokuFamily = loadCjkFont(loadYujiBoku, [400])
const zhiMangXingFamily = loadCjkFont(loadZhiMangXing, [400])

function createVariant(family, weights, allowItalic = false) {
    return { family, weights, allowItalic }
}

const FONT_LIBRARY = {
    archivo: createVariant(archivoFamily, [500, 600, 700], true),
    gloriaHallelujah: createVariant(gloriaHallelujahFamily, [400], false),
    ibmPlexSans: createVariant(ibmPlexSansFamily, [400, 500, 700], true),
    jetBrainsMono: createVariant(jetBrainsMonoFamily, [500, 700, 800], true),
    playfairDisplay: createVariant(playfairDisplayFamily, [400, 500, 600, 700], true),
    sourceSerif4: createVariant(sourceSerif4Family, [400, 500, 600, 700], true),
    spaceGrotesk: createVariant(spaceGroteskFamily, [400, 500, 700], false),
    notoSansSC: createVariant(notoSansScFamily, [400, 500, 700]),
    notoSerifSC: createVariant(notoSerifScFamily, [400, 600, 700]),
    notoSansTC: createVariant(notoSansTcFamily, [400, 500, 700]),
    notoSansJP: createVariant(notoSansJpFamily, [400, 500, 700]),
    notoSerifJP: createVariant(notoSerifJpFamily, [400, 600, 700]),
    zenKakuGothicNew: createVariant(zenKakuGothicNewFamily, [400, 500, 700]),
    zenOldMincho: createVariant(zenOldMinchoFamily, [400, 700]),
    dotGothic16: createVariant(dotGothic16Family, [400]),
    yujiBoku: createVariant(yujiBokuFamily, [400]),
    zhiMangXing: createVariant(zhiMangXingFamily, [400]),
}

export const OPENING_STYLE_GROUPS = ["clean", "editorial", "signal"]

const STYLE_GROUP_VARIANTS = {
    clean: {
        latin: [FONT_LIBRARY.archivo, FONT_LIBRARY.ibmPlexSans, FONT_LIBRARY.spaceGrotesk],
        cjk: [FONT_LIBRARY.notoSansSC, FONT_LIBRARY.notoSansTC, FONT_LIBRARY.notoSansJP, FONT_LIBRARY.zenKakuGothicNew, FONT_LIBRARY.zhiMangXing],
        japanese: [FONT_LIBRARY.notoSansJP, FONT_LIBRARY.zenKakuGothicNew],
    },
    editorial: {
        latin: [FONT_LIBRARY.playfairDisplay, FONT_LIBRARY.sourceSerif4, FONT_LIBRARY.archivo, FONT_LIBRARY.gloriaHallelujah],
        cjk: [FONT_LIBRARY.notoSerifSC, FONT_LIBRARY.notoSerifJP, FONT_LIBRARY.zenOldMincho, FONT_LIBRARY.zhiMangXing],
        japanese: [FONT_LIBRARY.notoSerifJP, FONT_LIBRARY.zenOldMincho, FONT_LIBRARY.yujiBoku],
    },
    signal: {
        latin: [FONT_LIBRARY.jetBrainsMono, FONT_LIBRARY.ibmPlexSans, FONT_LIBRARY.spaceGrotesk],
        cjk: [FONT_LIBRARY.zhiMangXing, FONT_LIBRARY.notoSansSC, FONT_LIBRARY.zenKakuGothicNew],
        japanese: [FONT_LIBRARY.dotGothic16, FONT_LIBRARY.zenKakuGothicNew, FONT_LIBRARY.notoSansJP],
    },
}

const SAFE_LATIN_VARIANTS = [FONT_LIBRARY.archivo, FONT_LIBRARY.ibmPlexSans, FONT_LIBRARY.spaceGrotesk]

const DEFAULT_FONT_FALLBACKS = [interFamily, notoSansScFamily, notoSansTcFamily, notoSansJpFamily, "sans-serif"]
const ANCHOR_SCENE_KINDS = new Set(["intro-typewriter", "intro-hold", "domain-lockup"])
const JAPANESE_KANA_PATTERN = /[\u3040-\u30ff\u31f0-\u31ff]/
const HAN_PATTERN = /[\u3400-\u9fff\uf900-\ufaff]/
const LATIN_DIACRITIC_PATTERN = /[\u00c0-\u024f]/

const ANCHOR_WEIGHTS = {
    left: 600,
    center: 700,
    right: 600,
    line: 500,
}

export const OPENING_ANCHOR_FONT_FAMILY = interFamily
export const OPENING_SAFE_LATIN_FONT_FAMILIES = SAFE_LATIN_VARIANTS.map((variant) => variant.family)
export const OPENING_FONT_POOL_FAMILIES = {
    latin: Array.from(new Set(OPENING_STYLE_GROUPS.flatMap((group) => STYLE_GROUP_VARIANTS[group].latin.map((variant) => variant.family)))),
    cjk: Array.from(new Set(OPENING_STYLE_GROUPS.flatMap((group) => STYLE_GROUP_VARIANTS[group].cjk.map((variant) => variant.family)))),
    japanese: Array.from(new Set(OPENING_STYLE_GROUPS.flatMap((group) => STYLE_GROUP_VARIANTS[group].japanese.map((variant) => variant.family)))),
}

function hashString(value) {
    let hash = 2166136261

    for (let index = 0; index < value.length; index += 1) {
        hash ^= value.charCodeAt(index)
        hash = Math.imul(hash, 16777619)
    }

    return hash >>> 0
}

function pickDeterministic(items, seedKey) {
    return items[hashString(seedKey) % items.length]
}

function quoteFontFamily(fontFamily) {
    return fontFamily.includes(" ") ? `"${fontFamily}"` : fontFamily
}

function buildFontStack(primaryFontFamily) {
    return Array.from(new Set([primaryFontFamily, ...DEFAULT_FONT_FALLBACKS]))
        .map((fontFamily) => quoteFontFamily(fontFamily))
        .join(", ")
}

function resolveFontPool(text) {
    if (JAPANESE_KANA_PATTERN.test(text)) return "japanese"
    if (HAN_PATTERN.test(text)) return "cjk"
    return "latin"
}

function isHighRiskLatinText(text) {
    return LATIN_DIACRITIC_PATTERN.test(text) || /\s/.test(text)
}

function pickSceneStyleGroup(seed, sceneId) {
    return pickDeterministic(OPENING_STYLE_GROUPS, `${seed}:${sceneId}:style-group`)
}

function resolveAnchorTypography(column) {
    return {
        primaryFontFamily: interFamily,
        fontFamily: buildFontStack(interFamily),
        fontWeight: ANCHOR_WEIGHTS[column] ?? 600,
        fontStyle: "normal",
        styleGroup: "anchor",
        safetyTier: "anchor",
        scriptPool: "latin",
    }
}

function filterWeights(weights, maxWeight) {
    const filtered = weights.filter((weight) => weight <= maxWeight)
    return filtered.length > 0 ? filtered : [Math.min(...weights)]
}

function resolveCenterSafeVariants(poolName, text) {
    const styleGroupVariants = OPENING_STYLE_GROUPS.flatMap((group) => STYLE_GROUP_VARIANTS[group][poolName])
    const dedupedVariants = Array.from(new Map(styleGroupVariants.map((variant) => [variant.family, variant])).values())

    if (poolName === "latin" && text === "und") {
        return dedupedVariants.filter((variant) => variant.family !== ibmPlexSansFamily)
    }

    return dedupedVariants
}

function resolveRandomVariant({ sceneStyleGroup, column, poolName, text }) {
    if (column === "center") {
        return {
            variants: resolveCenterSafeVariants(poolName, text),
            safetyTier: "center-safe",
        }
    }

    if (poolName === "latin" && isHighRiskLatinText(text)) {
        return {
            variants: SAFE_LATIN_VARIANTS,
            safetyTier: "safe-latin",
        }
    }

    return {
        variants: STYLE_GROUP_VARIANTS[sceneStyleGroup][poolName],
        safetyTier: "free",
    }
}

function resolveRandomTypography({ column, sceneId, seed, text }) {
    const poolName = resolveFontPool(text)
    const sceneStyleGroup = pickSceneStyleGroup(seed, sceneId)
    const { variants, safetyTier } = resolveRandomVariant({
        sceneStyleGroup,
        column,
        poolName,
        text,
    })
    const baseSeedKey = `${seed}:${sceneId}:${column}:${text}:${sceneStyleGroup}:${safetyTier}`
    const variant = pickDeterministic(variants, `${baseSeedKey}:family`)
    const allowItalic = safetyTier === "free" && poolName === "latin" && variant.allowItalic
    const fontStyle = allowItalic && hashString(`${baseSeedKey}:style`) % 4 === 0 ? "italic" : "normal"
    const eligibleWeights = safetyTier === "free" ? variant.weights : filterWeights(variant.weights, 600)
    const fontWeight = pickDeterministic(eligibleWeights, `${baseSeedKey}:weight`)

    return {
        primaryFontFamily: variant.family,
        fontFamily: buildFontStack(variant.family),
        fontWeight,
        fontStyle,
        styleGroup: sceneStyleGroup,
        safetyTier,
        scriptPool: poolName,
    }
}

export function resolveOpeningTypography({ sceneKind, sceneId, column, seed, text }) {
    if (ANCHOR_SCENE_KINDS.has(sceneKind)) {
        return resolveAnchorTypography(column)
    }

    return resolveRandomTypography({
        column,
        sceneId,
        seed,
        text,
    })
}
