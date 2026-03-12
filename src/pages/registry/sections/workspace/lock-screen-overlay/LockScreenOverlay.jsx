/**
 * [INPUT]: 依赖 React 的 `useEffect/useId/useState`、overlay layer 默认颜色表、lock-screen-overlay runtime helper、lock-screen-overlay.symbols / controls 几何常量、action glass 材质 helper，可接收外部 layer id -> CSS color 覆写、bgColor、overlayScale、wallpaperLang 与 showWidgets
 * [OUTPUT]: 对外提供 LockScreenOverlay 组件，按 `402x874` 坐标系渲染锁屏 overlay；其中底部 controls 改为 `shadow svg + glass dom + chrome svg` 混合结构，date-text 使用真实日期并按 Wallpaper Language 本地化，主时钟使用真实 24 小时制文本，`widgets-complication-1/3/4` 直接内联 jikan Sketch `iwatch` / `sun.horizon.fill` / `umbrella.fill` 原始 SVG 几何
 * [POS]: workspace/lock-screen-overlay 的渲染器，保留 jikan Sketch 真几何；Widgets/Date/Status 与底部 Stack 全部 inline，仅 `date-text` 使用本地化字体策略，其余 overlay 文字继续保持既有英文文本字体策略；支持上游按 preview type 控制整组 widgets 可见性；底部左右 action 通过 `402x874` 绝对 glass 平面承载真实 `backdrop-filter`，外阴影与图标仍复用 SVG 真相源
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { useEffect, useId, useState } from "react"
import { createLockScreenActionGlassMaterial } from "./lock-screen-overlay.colors"
import { LOCK_SCREEN_OVERLAY_DEFAULT_COLORS } from "./lock-screen-overlay.constants"
import {
    ACTION_CONTROL_CORNER_RADIUS,
    ACTION_CONTROL_FILTER_FRAME,
    ACTION_CONTROL_ICON_OPACITY,
    ACTION_LEFT_FRAME,
    ACTION_LEFT_ICON_PATH,
    ACTION_RIGHT_FRAME,
    ACTION_RIGHT_ICON_PATH,
    LOCK_SCREEN_CONTROLS_SKETCH_META,
    STACK_FRAME,
} from "./lock-screen-overlay.controls"
import {
    APPLE_WATCH_SYMBOL_PATH,
    SUN_HORIZON_FILL_BOTTOM_PATH,
    SUN_HORIZON_FILL_TOP_PATH,
    UMBRELLA_FILL_PATH,
} from "./lock-screen-overlay.symbols"
import {
    formatLockScreenDate,
    formatLockScreenTime24,
    getMsUntilNextMinute,
    isAppleRuntimePlatform,
    resolveLockScreenFontFamily,
} from "./lock-screen-overlay.runtime"

const OVERLAY_VIEWBOX_WIDTH = 402
const OVERLAY_VIEWBOX_HEIGHT = 874
const ACTION_GLASS_OFFSET_X = 0
const ACTION_GLASS_OFFSET_Y = 0

function joinClassName(...values) {
    return values.filter(Boolean).join(" ")
}

function resolveLayerColor(layerId, colors) {
    return colors[layerId] ?? LOCK_SCREEN_OVERLAY_DEFAULT_COLORS[layerId]
}

function resolveLayerStyle(layerId, colors, property = "fill") {
    return { [property]: resolveLayerColor(layerId, colors) }
}

function renderControlShadow({ actionFrame, backgroundLayerId, colors, filterId, nodeName }) {
    return (
        <g transform={`translate(${actionFrame.x} ${actionFrame.y})`} data-overlay-node={nodeName}>
            <g filter={`url(#${filterId})`}>
                <rect
                    width={actionFrame.width}
                    height={actionFrame.height}
                    rx={ACTION_CONTROL_CORNER_RADIUS}
                    style={{
                        ...resolveLayerStyle(backgroundLayerId, colors),
                        mixBlendMode: "screen",
                    }}
                    shapeRendering="crispEdges"
                    data-overlay-layer={backgroundLayerId}
                />
            </g>
        </g>
    )
}

function renderControlIcon({ actionFrame, iconLayerId, iconPath, iconGlyph, iconTransform, nodeName, colors }) {
    return (
        <g
            data-overlay-node={nodeName}
            data-sketch-master={LOCK_SCREEN_CONTROLS_SKETCH_META.master}
            data-sketch-glyph={iconGlyph}
            transform={`translate(${actionFrame.x} ${actionFrame.y})`}
        >
            <g
                data-overlay-layer={iconLayerId}
                opacity={ACTION_CONTROL_ICON_OPACITY}
                style={{
                    ...resolveLayerStyle(iconLayerId, colors),
                    mixBlendMode: "plus-lighter",
                }}
            >
                <path d={iconPath} transform={iconTransform} />
            </g>
        </g>
    )
}

function renderActionGlassPanel({ actionFrame, actionName, material }) {
    return (
        <div
            data-overlay-glass={actionName}
            className="absolute overflow-hidden rounded-full"
            style={{
                left: `${actionFrame.x + ACTION_GLASS_OFFSET_X}px`,
                top: `${STACK_FRAME.y + actionFrame.y + ACTION_GLASS_OFFSET_Y}px`,
                width: `${actionFrame.width}px`,
                height: `${actionFrame.height}px`,
                background: material.background,
                border: `1px solid ${material.borderColor}`,
                borderRadius: "9999px",
                boxSizing: "border-box",
                boxShadow: material.innerGlowShadow,
                backdropFilter: material.blur,
                transform: "rotate(-45deg)",
                transformOrigin: "center",
                WebkitBackdropFilter: material.blur,
            }}
        >
            <div
                aria-hidden="true"
                className="absolute left-0 top-0 h-px w-full"
                style={{
                    background: `linear-gradient(90deg, transparent, ${material.topHighlightColor}, transparent)`,
                }}
            />
            <div
                aria-hidden="true"
                className="absolute left-0 top-0 h-full w-px"
                style={{
                    background: `linear-gradient(180deg, ${material.leftHighlightColor}, transparent, rgba(255, 255, 255, 0.3))`,
                }}
            />
        </div>
    )
}

function LockScreenOverlay({
    backgroundColor,
    className,
    colors = {},
    overlayScale = 1,
    showWidgets = true,
    style,
    wallpaperLang,
}) {
    const [currentDate, setCurrentDate] = useState(() => new Date())
    const dateText = formatLockScreenDate(currentDate, wallpaperLang)
    const timeText = formatLockScreenTime24(currentDate)
    const isApplePlatform = isAppleRuntimePlatform(typeof navigator === "object" ? navigator : null)
    const overlayTextFontFamily = resolveLockScreenFontFamily(
        isApplePlatform,
        "en"
    )
    const dateTextFontFamily = resolveLockScreenFontFamily(
        isApplePlatform,
        wallpaperLang
    )
    const controlsFilterId = `lock-screen-controls-shadow-${useId().replace(/:/g, "")}`
    const actionGlassMaterial = createLockScreenActionGlassMaterial(backgroundColor)

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setCurrentDate(new Date())
        }, getMsUntilNextMinute(currentDate))

        return () => window.clearTimeout(timeoutId)
    }, [currentDate])

    return (
        <div
            aria-hidden="true"
            data-lock-screen-overlay="lock-screen"
            className={joinClassName("pointer-events-none absolute inset-0", className)}
            style={style}
        >
            <svg
                viewBox="0 0 402 874"
                focusable="false"
                className="absolute inset-0 block h-full w-full"
            >
                <defs>
                    <filter
                        id={controlsFilterId}
                        x={ACTION_CONTROL_FILTER_FRAME.x}
                        y={ACTION_CONTROL_FILTER_FRAME.y}
                        width={ACTION_CONTROL_FILTER_FRAME.width}
                        height={ACTION_CONTROL_FILTER_FRAME.height}
                        filterUnits="userSpaceOnUse"
                        colorInterpolationFilters="sRGB"
                    >
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha"
                        />
                        <feOffset dy="8" />
                        <feGaussianBlur stdDeviation="20" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0" />
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
                    </filter>
                </defs>

                <g transform="translate(0 766)">
                    {renderControlShadow({
                        actionFrame: ACTION_LEFT_FRAME,
                        backgroundLayerId: "action-left-bg",
                        colors,
                        filterId: controlsFilterId,
                        nodeName: "action-left",
                    })}
                    {renderControlShadow({
                        actionFrame: ACTION_RIGHT_FRAME,
                        backgroundLayerId: "action-right-bg",
                        colors,
                        filterId: controlsFilterId,
                        nodeName: "action-right",
                    })}
                </g>
            </svg>

            <div
                data-overlay-glass-layer="lock-screen-actions"
                className="absolute left-0 top-0 overflow-hidden"
                style={{
                    width: `${OVERLAY_VIEWBOX_WIDTH}px`,
                    height: `${OVERLAY_VIEWBOX_HEIGHT}px`,
                    transform: `scale(${overlayScale})`,
                    transformOrigin: "top left",
                }}
            >
                {renderActionGlassPanel({
                    actionFrame: ACTION_LEFT_FRAME,
                    actionName: "action-left",
                    material: actionGlassMaterial,
                })}
                {renderActionGlassPanel({
                    actionFrame: ACTION_RIGHT_FRAME,
                    actionName: "action-right",
                    material: actionGlassMaterial,
                })}
            </div>

            <svg
                viewBox="0 0 402 874"
                focusable="false"
                className="absolute inset-0 block h-full w-full"
            >
                <g data-overlay-layer="home-indicator" transform="translate(0 830)" style={resolveLayerStyle("home-indicator", colors)}>
                    <path
                        fillRule="evenodd"
                        d="M131.5,21 L270.5,21 C271.880712,21 273,22.1192881 273,23.5 C273,24.8807119 271.880712,26 270.5,26 L131.5,26 C130.119288,26 129,24.8807119 129,23.5 C129,22.1192881 130.119288,21 131.5,21 Z"
                    />
                </g>

                <g
                    data-overlay-node="stack"
                    data-sketch-page={LOCK_SCREEN_CONTROLS_SKETCH_META.page}
                    data-sketch-root={LOCK_SCREEN_CONTROLS_SKETCH_META.root}
                    data-sketch-stack={LOCK_SCREEN_CONTROLS_SKETCH_META.stack}
                    transform="translate(0 766)"
                >
                    {renderControlIcon({
                        actionFrame: ACTION_LEFT_FRAME,
                        iconLayerId: "action-left-icon",
                        iconPath: ACTION_LEFT_ICON_PATH,
                        iconGlyph: LOCK_SCREEN_CONTROLS_SKETCH_META.leftGlyphOverride,
                        iconTransform: `translate(${-ACTION_LEFT_FRAME.x} ${-STACK_FRAME.y})`,
                        nodeName: "action-left",
                        colors,
                    })}
                    {renderControlIcon({
                        actionFrame: ACTION_RIGHT_FRAME,
                        iconLayerId: "action-right-icon",
                        iconPath: ACTION_RIGHT_ICON_PATH,
                        iconGlyph: LOCK_SCREEN_CONTROLS_SKETCH_META.rightGlyphOverride,
                        iconTransform: `translate(${-ACTION_RIGHT_FRAME.x} ${-STACK_FRAME.y})`,
                        nodeName: "action-right",
                        colors,
                    })}
                </g>

                {showWidgets ? (
                    <g transform="translate(30 679)">
                        <g transform="translate(270 0)">
                            <g data-overlay-layer="widgets-complication-4-bg" style={resolveLayerStyle("widgets-complication-4-bg", colors)}>
                                <path
                                    fillRule="evenodd"
                                    d="M65,36 C65,52.0167801 52.0158315,65 36,65 C19.9832199,65 7,52.0167801 7,36 C7,19.9832199 19.9832199,7 36,7 C52.0158315,7 65,19.9832199 65,36"
                                />
                            </g>
                            <g data-overlay-layer="widgets-complication-4-fg" style={resolveLayerStyle("widgets-complication-4-fg", colors)}>
                                <text x="19.2115942" y="40" fontFamily={overlayTextFontFamily} fontSize="15" fontWeight="500">
                                    8:26
                                </text>
                                <text x="27.6345215" y="55" fontFamily={overlayTextFontFamily} fontSize="11" fontWeight="400">
                                    PM
                                </text>
                                <g transform="translate(27.415 12.242) scale(0.6861)">
                                    <path d={SUN_HORIZON_FILL_TOP_PATH} />
                                    <path d={SUN_HORIZON_FILL_BOTTOM_PATH} />
                                </g>
                            </g>
                        </g>

                        <g transform="translate(180 0)">
                            <g data-overlay-layer="widgets-complication-3-bg" style={resolveLayerStyle("widgets-complication-3-bg", colors)}>
                                <path
                                    fillRule="evenodd"
                                    d="M65,36 C65,43.8325469 61.8948413,50.9398452 56.8483887,56.1580301 L56.8192561,56.1292934 C56.3208469,56.8498546 55.4886453,57.3219048 54.5461905,57.3219048 C53.0208326,57.3219048 51.7842857,56.0853579 51.7842857,54.56 C51.7842857,53.6175452 52.2563359,52.7853436 52.9768971,52.2869344 L52.9413476,52.2518843 C56.9887612,48.0338563 59.4761905,42.3074133 59.4761905,36 C59.4761905,24.3383512 50.9732708,14.6626657 39.8290033,12.8345154 C40.5021073,11.9894607 40.904762,10.9179434 40.904762,9.752381 C40.904762,8.86494252 40.6713419,8.03202223 40.2625482,7.31166663 C54.2574077,9.37201223 65,21.4314727 65,36 Z M31,9.752381 C31,10.9244445 31.407159,12.001411 32.0877513,12.8495547 C20.9844825,14.7108114 12.5238095,24.3673577 12.5238095,36 C12.5238095,42.6586255 15.2959634,48.6697797 19.7491123,52.9423038 L19.7164044,52.9756754 C20.0310454,53.4241873 20.2157143,53.9705278 20.2157143,54.56 C20.2157143,56.0853579 18.9791674,57.3219048 17.4538095,57.3219048 C16.8637043,57.3219048 16.3168236,57.1368391 15.8680404,56.8215809 L15.8419699,56.8483887 C10.3898333,51.5756837 7,44.1837108 7,36 C7,21.4680315 17.6887441,9.43255302 31.6331865,7.32661039 C31.2299314,8.04452105 31,8.87159935 31,9.752381 Z"
                                />
                            </g>
                            <g data-overlay-layer="widgets-complication-3-fg" style={resolveLayerStyle("widgets-complication-3-fg", colors)}>
                                <circle
                                    cx="35.95"
                                    cy="9.65"
                                    r="2.75"
                                    fillRule="nonzero"
                                    transform="translate(35.95 9.65) rotate(90) translate(-35.95 -9.65)"
                                />
                                <path d={UMBRELLA_FILL_PATH} transform="translate(28.572 46.433) scale(0.797)" />
                                <text x="17.6740723" y="39" fontFamily={overlayTextFontFamily} fontSize="17" fontWeight="400">
                                    50%
                                </text>
                            </g>
                        </g>

                        <g transform="translate(90 0)">
                            <g transform="translate(7 7)">
                                <g data-overlay-layer="widgets-complication-2-bg" style={resolveLayerStyle("widgets-complication-2-bg", colors)}>
                                    <path
                                        fillRule="evenodd"
                                        d="M58,28.9798986 C58,34.135712 56.6429884,39.1005509 54.1056161,43.4751446 C53.2577089,44.9369913 51.3857625,45.4344096 49.9245068,44.5861595 C48.4632511,43.7379094 47.9660339,41.8652059 48.8139411,40.4033592 C50.8142469,36.954703 51.8819888,33.0482025 51.8819888,28.9798986 C51.8819888,23.5425687 49.9818399,18.5484897 46.8085953,14.6244779 C48.9743633,14.1795374 50.7048005,12.5327621 51.2698066,10.4158039 C55.4714661,15.4434823 58,21.9163821 58,28.9798986 Z M29.0004749,0 C34.1221446,0 38.9338053,1.32679978 43.1099447,3.65528404 C41.1761333,4.583092 39.8299955,6.54477645 39.7929339,8.8183212 C36.5793997,7.09698299 32.9041821,6.12048558 29.0004749,6.12048558 C16.3614632,6.12048558 6.1180112,16.3553242 6.1180112,28.9798986 C6.1180112,33.0469666 7.18602963,36.9536979 9.18634515,40.4038529 C10.0339798,41.8658577 9.53641351,43.7384684 8.07499972,44.5864459 C6.61358594,45.4344233 4.74173233,44.9366558 3.89409768,43.474651 C1.3572301,39.099048 0,34.1344022 0,28.9798986 C0,12.9733655 12.9842837,0 29.0004749,0 Z"
                                    />
                                </g>
                                <g data-overlay-layer="widgets-complication-2-fg" style={resolveLayerStyle("widgets-complication-2-fg", colors)}>
                                    <circle cx="45.5" cy="9.2203" r="3.5" fillRule="nonzero" />
                                    <text x="14.8560182" y="35.5" fontFamily={overlayTextFontFamily} fontSize="24.5203082" fontWeight="400">
                                        72
                                    </text>
                                </g>
                            </g>
                            <text
                                data-overlay-layer="widgets-complication-2-fg"
                                x="25.451483"
                                y="62"
                                fontFamily={overlayTextFontFamily}
                                fontSize="12.2601541"
                                fontWeight="400"
                                style={resolveLayerStyle("widgets-complication-2-fg", colors)}
                            >
                                AQI
                            </text>
                        </g>

                        <g>
                            <g data-overlay-layer="widgets-complication-1-bg" style={resolveLayerStyle("widgets-complication-1-bg", colors)}>
                                <path
                                    fillRule="evenodd"
                                    d="M36,7 C52.0162577,7 65,19.9837423 65,36 C65,52.0162577 52.0162577,65 36,65 C19.9837423,65 7,52.0162577 7,36 C7,19.9837423 19.9837423,7 36,7 Z M36,12.5238095 C23.034458,12.5238095 12.5238095,23.034458 12.5238095,36 C12.5238095,48.965542 23.034458,59.4761905 36,59.4761905 C48.965542,59.4761905 59.4761905,48.965542 59.4761905,36 C59.4761905,23.034458 48.965542,12.5238095 36,12.5238095 Z"
                                />
                            </g>
                            <g data-overlay-layer="widgets-complication-1-fg" style={resolveLayerStyle("widgets-complication-1-fg", colors)}>
                                <path
                                    fillRule="evenodd"
                                    d="M35.8317525,12.518769 C34.3847423,12.4318173 33.2380952,11.2307679 33.2380952,9.76190476 C33.2380952,8.23654688 34.4746421,7 36,7 C52.0162577,7 65,19.9837423 65,36 C65,52.0162577 52.0162577,65 36,65 C27.9918711,65 20.7418711,61.7540644 15.4939033,56.5060967 L15.5013483,56.4996523 C15.0012478,55.9998064 14.6919048,55.3091239 14.6919048,54.5461905 C14.6919048,53.0208326 15.9284516,51.7842857 17.4538095,51.7842857 C18.2901248,51.7842857 19.0396219,52.1559982 19.5461006,52.7432227 L19.4489048,52.649 L19.7060231,52.9008575 C23.9280078,56.9721655 29.6715807,59.4761905 36,59.4761905 C48.965542,59.4761905 59.4761905,48.965542 59.4761905,36 C59.4761905,23.034458 48.965542,12.5238095 36,12.5238095 Z"
                                />
                                <path d={APPLE_WATCH_SYMBOL_PATH} transform="translate(27.16404 23.45508) scale(1.2)" />
                            </g>
                        </g>
                    </g>
                ) : null}

                <rect
                    x="301.7"
                    y="46.8"
                    width="48"
                    height="2.33333"
                    rx="1.16666496"
                    fillRule="evenodd"
                    data-overlay-layer="swipe-indicator"
                    style={resolveLayerStyle("swipe-indicator", colors)}
                />

                <g transform="translate(0 79)">
                    <g data-overlay-layer="time-shape" style={resolveLayerStyle("time-shape", colors)}>
                        <text
                            x="201"
                            y="95"
                            fontFamily={overlayTextFontFamily}
                            fontSize="120"
                            fontWeight="500"
                            textAnchor="middle"
                            dominantBaseline="middle"
                        >
                            {timeText}
                        </text>
                    </g>

                    <text
                        data-overlay-layer="date-text"
                        x="201"
                        y="21"
                        fontFamily={dateTextFontFamily}
                        fontSize="22"
                        fontWeight="500"
                        textAnchor="middle"
                        style={resolveLayerStyle("date-text", colors)}
                    >
                        {dateText}
                    </text>
                </g>

                <g transform="translate(18 19)">
                    <g data-overlay-layer="status-bar-trailing" transform="translate(251.75 0)" style={resolveLayerStyle("status-bar-trailing", colors)}>
                        <g transform="translate(69 7)">
                            <g data-overlay-layer="battery">
                                <path
                                    d="M22.431852,0.947218678 L22.5643838,1.01524196 C23.1779904,1.3434023 23.6565628,1.82197473 23.9847232,2.43558126 C24.3623857,3.14174873 24.4999651,3.84022214 24.4999651,5.4141136 L24.4999651,7.5858864 C24.4999651,9.15977786 24.3623857,9.85825127 23.9847232,10.5644187 C23.6565628,11.1780253 23.1779904,11.6565977 22.5643838,11.9847581 C21.8582164,12.3624206 21.159743,12.5 19.5858515,12.5 L5.4141136,12.5 C3.84022214,12.5 3.14174873,12.3624206 2.43558126,11.9847581 C1.82197473,11.6565977 1.3434023,11.1780253 1.01524194,10.5644187 C0.637579442,9.85825127 0.5,9.15977786 0.5,7.5858864 L0.5,5.4141136 C0.5,3.84022214 0.637579442,3.14174873 1.01524194,2.43558126 C1.3434023,1.82197473 1.82197473,1.3434023 2.43558126,1.01524194 C3.14174873,0.637579442 3.84022214,0.5 5.4141136,0.5 L19.5858515,0.5 C21.0613747,0.5 21.7674876,0.620919432 22.431852,0.947218678 Z"
                                    opacity="0.35"
                                    fill="none"
                                    style={resolveLayerStyle("battery", colors, "stroke")}
                                />
                                <path
                                    d="M26,4.66666667 L26,8.66666667 C26.80473,8.32789015 27.3280362,7.53979995 27.3280362,6.66666667 C27.3280362,5.79353339 26.80473,5.00544318 26,4.66666667"
                                    fillRule="nonzero"
                                    opacity="0.4"
                                    style={resolveLayerStyle("battery", colors)}
                                />
                                <path
                                    d="M5.2048565,2 L19.7951142,2 C20.9095126,2 21.3136204,2.11603201 21.7210278,2.33391588 C22.1284352,2.55179975 22.4481709,2.87153546 22.6660548,3.27894287 C22.8839387,3.68635028 22.9999707,4.09045808 22.9999707,5.2048565 L22.9999707,7.7951435 C22.9999707,8.90954192 22.8839387,9.31364972 22.6660548,9.72105713 C22.4481709,10.1284645 22.1284352,10.4482003 21.7210278,10.6660841 C21.3136204,10.883968 20.9095126,11 19.7951142,11 L5.2048565,11 C4.09045808,11 3.68635028,10.883968 3.27894287,10.6660841 C2.87153546,10.4482003 2.55179975,10.1284645 2.33391588,9.72105713 C2.11603201,9.31364972 2,8.90954192 2,7.7951435 L2,5.2048565 C2,4.09045808 2.11603201,3.68635028 2.33391588,3.27894287 C2.55179975,2.87153546 2.87153546,2.55179975 3.27894287,2.33391588 C3.68635028,2.11603201 4.09045808,2 5.2048565,2 Z"
                                    fillRule="nonzero"
                                    style={resolveLayerStyle("battery", colors)}
                                />
                            </g>
                        </g>
                        <path
                            data-overlay-layer="wifi"
                            fillRule="nonzero"
                            d="M53.3591766,9.62060942 C55.8463341,9.62071261 58.2383855,10.5257199 60.0409295,12.1485798 C60.1766658,12.2738707 60.3936256,12.2722903 60.5273105,12.1450368 L61.8248254,10.9049672 C61.8925163,10.8404246 61.9302564,10.7529979 61.9297009,10.6620331 C61.929133,10.5710684 61.8903156,10.4840656 61.8218323,10.4202771 C57.0907317,6.12657428 49.6268732,6.12657428 44.8957725,10.4202771 C44.8272393,10.4840183 44.7883543,10.5709946 44.7877146,10.6619595 C44.7870904,10.7529244 44.8247636,10.8403777 44.8924053,10.9049672 L46.1902943,12.1450368 C46.323894,12.2724823 46.5410212,12.274064 46.6766754,12.1485798 C48.4794489,10.5256134 50.8717751,9.62060348 53.3591766,9.62060942 L53.3591766,9.62060942 Z M53.3573913,13.7627299 C54.7147359,13.7626471 56.0236422,14.2649101 57.0297794,15.1719252 C57.1658642,15.3006513 57.3802334,15.2978605 57.5128905,15.1656358 L58.800196,13.8707595 C58.8679885,13.8028396 58.9056037,13.7107003 58.9046445,13.6149555 C58.9036481,13.5192108 58.8641589,13.4278519 58.7949932,13.3613182 C55.7311036,10.524005 50.9862803,10.524005 47.9223906,13.3613182 C47.8531819,13.4278511 47.8136952,13.5192558 47.812771,13.6150315 C47.8118787,13.7108071 47.8496249,13.8029377 47.9175595,13.8707595 L49.2044934,15.1656358 C49.3371505,15.2978605 49.5515196,15.3006513 49.6876045,15.1719252 C50.6930766,14.2655094 52.0009438,13.7632894 53.3573913,13.7627299 L53.3573913,13.7627299 Z M55.7770809,16.7800753 C55.84438,16.7076346 55.881442,16.6079465 55.8795166,16.5045473 C55.8775912,16.4011481 55.8368491,16.3032027 55.7669094,16.2338361 C54.3767843,14.9442768 52.3408203,14.9442768 50.9506952,16.2338361 C50.880707,16.303147 50.8398982,16.4010615 50.837904,16.5044612 C50.8359098,16.6078609 50.8729071,16.7075806 50.9401604,16.7800753 L53.1172287,19.1893446 C53.181037,19.2601513 53.2680314,19.3 53.3588023,19.3 C53.4495732,19.3 53.5365676,19.2601513 53.6003759,19.1893446 L55.7770809,16.7800753 Z"
                            style={resolveLayerStyle("wifi", colors)}
                        />
                        <path
                            data-overlay-layer="cellular"
                            fillRule="nonzero"
                            d="M19.1543736,14.5 L20.2210403,14.5 C20.810144,14.5 21.2877069,15.0148725 21.2877069,15.65 L21.2877069,17.95 C21.2877069,18.5851275 20.810144,19.1 20.2210403,19.1 L19.1543736,19.1 C18.5652699,19.1 18.0877069,18.5851275 18.0877069,17.95 L18.0877069,15.65 C18.0877069,15.0148725 18.5652699,14.5 19.1543736,14.5 L19.1543736,14.5 Z M24.4543736,12.1 L25.5210403,12.1 C26.110144,12.1 26.5877069,12.6223345 26.5877069,13.2666667 L26.5877069,17.9333333 C26.5877069,18.5776655 26.110144,19.1 25.5210403,19.1 L24.4543736,19.1 C23.8652699,19.1 23.3877069,18.5776655 23.3877069,17.9333333 L23.3877069,13.2666667 C23.3877069,12.6223345 23.8652699,12.1 24.4543736,12.1 Z M29.8543736,9.5 L30.9210403,9.5 C31.510144,9.5 31.9877069,10.015768 31.9877069,10.652 L31.9877069,17.948 C31.9877069,18.584232 31.510144,19.1 30.9210403,19.1 L29.8543736,19.1 C29.2652699,19.1 28.7877069,18.584232 28.7877069,17.948 L28.7877069,10.652 C28.7877069,10.015768 29.2652699,9.5 29.8543736,9.5 Z M36.2210403,7.1 C36.810144,7.1 37.2877069,7.60367966 37.2877069,8.225 L37.2877069,17.975 C37.2877069,18.5963203 36.810144,19.1 36.2210403,19.1 L35.1543736,19.1 C34.5652699,19.1 34.0877069,18.5963203 34.0877069,17.975 L34.0877069,8.225 C34.0877069,7.60367966 34.5652699,7.1 35.1543736,7.1 L36.2210403,7.1 Z"
                            style={resolveLayerStyle("cellular", colors)}
                        />
                    </g>

                    {/*
                     * [NOTE]: 状态栏左上角时间隐藏，避免与主时钟重复。
                     */}
                    {/*
                    <g data-overlay-layer="status-bar-leading" style={resolveLayerStyle("status-bar-leading", colors)}>
                        <g transform="translate(13.3889 2)">
                            <text x="25.0311649" y="16" fontFamily={overlayTextFontFamily} fontSize="17" fontWeight="500">
                                {timeText}
                            </text>
                        </g>
                    </g>
                    */}
                </g>
            </svg>
        </div>
    )
}

export { LockScreenOverlay }
