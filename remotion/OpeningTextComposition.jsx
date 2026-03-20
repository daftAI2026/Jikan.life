/**
 * [INPUT]: 依赖 react、remotion、zod、./opening-fonts.js、./opening-layout.js 与 ./opening-timeline.js
 * [OUTPUT]: 对外提供 OpeningTextComposition 组件与其 props schema
 * [POS]: remotion/ 的主渲染器，负责主题、排版与逐帧文本呈现，被 Studio 与首页 OpeningIntroOverlay 共同复用
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import React, { useState } from "react"
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion"
import { z } from "zod"
import { resolveOpeningTypography } from "./opening-fonts.js"
import { resolveOpeningLayoutMetrics, resolveTypewriterCursorMetrics } from "./opening-layout.js"
import { resolveOpeningFrameState, resolveTypewriterCursorState } from "./opening-timeline.js"

const THEME_STYLES = {
    light: {
        pageBackground: "var(--color-kumo-base, #efe7da)",
        maskBackground: "var(--color-kumo-base, #efe7da)",
        textColor: "var(--text-color-kumo-default, #13110d)",
    },
    dark: {
        pageBackground: "var(--color-kumo-base, #090b0d)",
        maskBackground: "var(--color-kumo-base, #090b0d)",
        textColor: "var(--text-color-kumo-default, #f4f0e8)",
    },
}

export const OpeningTextCompositionSchema = z.object({
    theme: z.enum(["light", "dark"]).default("light"),
    seed: z.number().int().optional(),
    fadeOut: z.boolean().default(true),
    debugLayout: z.boolean().default(false),
})

const DEBUG_STROKE_COLOR = "rgba(255, 0, 0, 0.9)"
const DEBUG_STROKE_WIDTH = 1

function ColumnText({ align, children, style }) {
    return (
        <div
            style={{
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                textAlign: align,
                whiteSpace: "nowrap",
                ...style,
            }}
        >
            {children}
        </div>
    )
}

function SingleLineText({ children, style }) {
    return (
        <div
            style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                whiteSpace: "nowrap",
                textAlign: "center",
                ...style,
            }}
        >
            {children}
        </div>
    )
}

function DebugLayoutBox({ label, style }) {
    return (
        <div
            aria-hidden="true"
            style={{
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                boxSizing: "border-box",
                border: `${DEBUG_STROKE_WIDTH}px solid ${DEBUG_STROKE_COLOR}`,
                backgroundColor: "rgba(255, 0, 0, 0.05)",
                pointerEvents: "none",
                color: DEBUG_STROKE_COLOR,
                ...style,
            }}
        >
            <div
                style={{
                    position: "absolute",
                    left: 6,
                    top: 6,
                    fontFamily: "monospace",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 0,
                    lineHeight: 1,
                }}
            >
                {label}
            </div>
        </div>
    )
}

function InlineTypewriterText({ text, cursorVisible, cursorMetrics, style }) {
    return (
        <span
            style={{
                display: "inline-flex",
                alignItems: "flex-end",
                gap: cursorVisible ? cursorMetrics.gap : 0,
                ...style,
            }}
        >
            <span>{text}</span>
            {cursorVisible ? (
                <span
                    aria-hidden="true"
                    style={{
                        display: "inline-block",
                        width: cursorMetrics.width,
                        height: cursorMetrics.height,
                        borderRadius: cursorMetrics.borderRadius,
                        backgroundColor: "currentColor",
                        opacity: cursorMetrics.opacity,
                        flex: "0 0 auto",
                    }}
                />
            ) : null}
        </span>
    )
}

function resolveIntroCursorColumn(scene, renderedPhrase) {
    if (scene.kind !== "intro-typewriter" && scene.kind !== "intro-hold") return null
    if (scene.singleLine) return "line"
    if (renderedPhrase.right.length > 0) return "right"
    if (renderedPhrase.center.length > 0) return "center"
    return "left"
}

export function OpeningTextComposition({ theme = "light", seed, fadeOut = true, debugLayout = false }) {
    const frame = useCurrentFrame()
    const { width, height } = useVideoConfig()
    const [stableSeed] = useState(() => seed ?? Date.now())
    const stageWidth = width
    const stageHeight = height

    const themeStyle = THEME_STYLES[theme]
    const frameState = resolveOpeningFrameState(frame, stableSeed)
    const { scene, renderedPhrase, fadeProgress } = frameState
    const layoutLeftText = scene.singleLine ? "" : scene.left ?? renderedPhrase.left
    const layoutCenterText = scene.singleLine ? "" : scene.center ?? renderedPhrase.center
    const layoutRightText = scene.singleLine ? "" : scene.right ?? renderedPhrase.right
    const leftTypography = resolveOpeningTypography({
        seed: stableSeed,
        sceneId: scene.id,
        sceneKind: scene.kind,
        column: "left",
        text: renderedPhrase.left,
    })
    const centerTypography = resolveOpeningTypography({
        seed: stableSeed,
        sceneId: scene.id,
        sceneKind: scene.kind,
        column: "center",
        text: renderedPhrase.center,
    })
    const rightTypography = resolveOpeningTypography({
        seed: stableSeed,
        sceneId: scene.id,
        sceneKind: scene.kind,
        column: "right",
        text: renderedPhrase.right,
    })
    const lineTypography = resolveOpeningTypography({
        seed: stableSeed,
        sceneId: scene.id,
        sceneKind: scene.kind,
        column: "line",
        text: renderedPhrase.lineText ?? "",
    })
    const cursorState = resolveTypewriterCursorState(scene.kind, frameState.localFrame)
    const cursorColumn = resolveIntroCursorColumn(scene, renderedPhrase)
    const leftCursorVisible = cursorState.visible && cursorColumn === "left"
    const centerCursorVisible = cursorState.visible && cursorColumn === "center"
    const rightCursorVisible = cursorState.visible && cursorColumn === "right"
    const lineCursorVisible = cursorState.visible && cursorColumn === "line"
    const textMetrics = resolveOpeningLayoutMetrics({
        width: stageWidth,
        leftText: layoutLeftText,
        centerText: layoutCenterText,
        rightText: layoutRightText,
        lineText: renderedPhrase.lineText ?? "",
    })
    const lineCursorMetrics = {
        ...resolveTypewriterCursorMetrics(textMetrics.lineFontSize),
        opacity: cursorState.opacity,
    }
    const centerCursorMetrics = {
        ...resolveTypewriterCursorMetrics(textMetrics.centerFontSize),
        opacity: cursorState.opacity,
    }
    const overlayOpacity = fadeOut ? 1 - fadeProgress : 1

    return (
        <AbsoluteFill style={{ backgroundColor: themeStyle.pageBackground }}>
            <AbsoluteFill
                style={{
                    backgroundColor: themeStyle.maskBackground,
                    color: themeStyle.textColor,
                    opacity: overlayOpacity,
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        width: stageWidth,
                        height: stageHeight,
                        transform: "translate(-50%, -50%)",
                        transformOrigin: "center center",
                    }}
                >
                    {debugLayout ? (
                        <>
                            <DebugLayoutBox
                                label="left lane"
                                style={{
                                    left: textMetrics.leftLaneLeftEdge,
                                    width: textMetrics.leftLaneWidth,
                                    height: textMetrics.lineFontSize * 1.8,
                                }}
                            />
                            <DebugLayoutBox
                                label="center reserve"
                                style={{
                                    left: textMetrics.centerLeftEdge,
                                    width: textMetrics.centerReserve,
                                    height: Math.max(textMetrics.centerFontSize * 1.8, textMetrics.lineFontSize * 1.3),
                                }}
                            />
                            <DebugLayoutBox
                                label="right lane"
                                style={{
                                    left: textMetrics.rightLaneLeftEdge,
                                    width: textMetrics.rightLaneWidth,
                                    height: textMetrics.lineFontSize * 1.8,
                                }}
                            />
                        </>
                    ) : null}
                    {scene.singleLine ? (
                        <SingleLineText
                            style={{
                                fontFamily: lineTypography.fontFamily,
                                fontSize: textMetrics.lineFontSize,
                                fontStyle: lineTypography.fontStyle,
                                fontWeight: lineTypography.fontWeight,
                                letterSpacing: textMetrics.letterSpacing,
                                lineHeight: 1,
                            }}
                        >
                            <InlineTypewriterText
                                text={renderedPhrase.lineText}
                                cursorVisible={lineCursorVisible}
                                cursorMetrics={lineCursorMetrics}
                            />
                        </SingleLineText>
                    ) : (
                        <>
                            <ColumnText
                                align="right"
                                style={{
                                    fontFamily: leftTypography.fontFamily,
                                    left: textMetrics.leftLaneLeftEdge,
                                    width: textMetrics.leftLaneWidth,
                                    fontSize: textMetrics.lineFontSize,
                                    fontStyle: leftTypography.fontStyle,
                                    fontWeight: leftTypography.fontWeight,
                                    letterSpacing: textMetrics.letterSpacing,
                                    lineHeight: 1.05,
                                }}
                            >
                                <InlineTypewriterText
                                    text={renderedPhrase.left}
                                    cursorVisible={leftCursorVisible}
                                    cursorMetrics={lineCursorMetrics}
                                />
                            </ColumnText>

                            <ColumnText
                                align="center"
                                style={{
                                    fontFamily: centerTypography.fontFamily,
                                    left: textMetrics.centerLeftEdge,
                                    width: textMetrics.centerReserve,
                                    transform: "translateY(-50%)",
                                    fontSize: textMetrics.centerFontSize,
                                    fontStyle: centerTypography.fontStyle,
                                    fontWeight: centerTypography.fontWeight,
                                    letterSpacing: textMetrics.letterSpacing,
                                    lineHeight: 1,
                                }}
                            >
                                <InlineTypewriterText
                                    text={renderedPhrase.center}
                                    cursorVisible={centerCursorVisible}
                                    cursorMetrics={centerCursorMetrics}
                                />
                            </ColumnText>

                            <ColumnText
                                align="left"
                                style={{
                                    fontFamily: rightTypography.fontFamily,
                                    left: textMetrics.rightLaneLeftEdge,
                                    width: textMetrics.rightLaneWidth,
                                    fontSize: textMetrics.lineFontSize,
                                    fontStyle: rightTypography.fontStyle,
                                    fontWeight: rightTypography.fontWeight,
                                    letterSpacing: textMetrics.letterSpacing,
                                    lineHeight: 1.05,
                                }}
                            >
                                <InlineTypewriterText
                                    text={renderedPhrase.right}
                                    cursorVisible={rightCursorVisible}
                                    cursorMetrics={lineCursorMetrics}
                                />
                            </ColumnText>
                        </>
                    )}
                </div>

                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        border: `${Math.max(1, Math.round(height * 0.002))}px solid ${themeStyle.textColor}10`,
                    }}
                />
            </AbsoluteFill>
        </AbsoluteFill>
    )
}
