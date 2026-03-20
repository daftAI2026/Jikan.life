/**
 * [INPUT]: 依赖 react(useEffect/useRef/useState)、@remotion/player、../../remotion/OpeningTextComposition.jsx 与 ../../remotion/opening-timeline.js
 * [OUTPUT]: 对外提供 OpeningIntroOverlay 组件，在首页壳层播放固定 1:1 Remotion 开场画布，并通过外层等比缩放嵌入全屏
 * [POS]: src/components 的首页品牌开场遮罩，挂在 HomePage 之上并在片头结束后自卸载
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { useEffect, useRef, useState } from "react"
import { Player } from "@remotion/player"
import { OpeningTextComposition } from "../../remotion/OpeningTextComposition.jsx"
import { OPENING_DURATION_IN_FRAMES, OPENING_FPS, OPENING_HEIGHT, OPENING_WIDTH } from "../../remotion/opening-timeline.js"

const EXIT_FADE_DURATION_MS = 420
const OVERLAY_VIEWPORT_SCALE = 80
const OVERLAY_VIEWPORT_SIZE = `min(${OVERLAY_VIEWPORT_SCALE}vw, ${OVERLAY_VIEWPORT_SCALE}vh)`
const MODES = new Set(["light", "dark"])

function getInitialTheme() {
    if (typeof window === "undefined") return "light"

    const storedMode = window.localStorage.getItem("mode")
    if (MODES.has(storedMode)) return storedMode

    const attrMode = document.documentElement.getAttribute("data-mode")
    if (MODES.has(attrMode)) return attrMode

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function OpeningIntroOverlay() {
    const playerRef = useRef(null)
    const exitTimeoutRef = useRef(null)
    const [theme] = useState(getInitialTheme)
    const [playbackState, setPlaybackState] = useState("playing")
    const shouldRenderPlayer = playbackState === "playing"

    useEffect(() => {
        const player = playerRef.current
        if (!player) return undefined

        const handleEnded = () => {
            setPlaybackState("exiting")

            if (exitTimeoutRef.current !== null) {
                window.clearTimeout(exitTimeoutRef.current)
            }

            exitTimeoutRef.current = window.setTimeout(() => {
                setPlaybackState("hidden")
                exitTimeoutRef.current = null
            }, EXIT_FADE_DURATION_MS)
        }

        player.addEventListener("ended", handleEnded)

        return () => {
            player.removeEventListener("ended", handleEnded)

            if (exitTimeoutRef.current !== null) {
                window.clearTimeout(exitTimeoutRef.current)
                exitTimeoutRef.current = null
            }
        }
    }, [])

    if (playbackState === "hidden") return null

    return (
        <div
            aria-hidden="true"
            className="fixed inset-0 z-[200] bg-kumo-base transition-opacity duration-500"
            style={{
                position: "fixed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: playbackState === "playing" ? 1 : 0,
                pointerEvents: playbackState === "playing" ? "auto" : "none",
            }}
        >
            {shouldRenderPlayer ? (
                <Player
                    ref={playerRef}
                    component={OpeningTextComposition}
                    inputProps={{ theme }}
                    durationInFrames={OPENING_DURATION_IN_FRAMES}
                    compositionWidth={OPENING_WIDTH}
                    compositionHeight={OPENING_HEIGHT}
                    fps={OPENING_FPS}
                    autoPlay
                    controls={false}
                    loop={false}
                    clickToPlay={false}
                    showVolumeControls={false}
                    allowFullscreen={false}
                    style={{
                        width: OVERLAY_VIEWPORT_SIZE,
                        height: OVERLAY_VIEWPORT_SIZE,
                    }}
                />
            ) : null}
        </div>
    )
}

export { OpeningIntroOverlay }
