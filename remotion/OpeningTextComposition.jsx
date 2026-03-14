/**
 * [INPUT]: 依赖 react、remotion、zod、./opening-fonts.js、./opening-layout.js 与 ./opening-timeline.js
 * [OUTPUT]: 对外提供 OpeningTextComposition 组件与其 props schema
 * [POS]: remotion/ 的主渲染器，负责主题、排版与逐帧文本呈现
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
        pageBackground: "#efe7da",
        maskBackground: "#fffaf0",
        textColor: "#13110d",
    },
    dark: {
        pageBackground: "#090b0d",
        maskBackground: "#14181b",
        textColor: "#f4f0e8",
    },
}

export const OpeningTextCompositionSchema = z.object({
    theme: z.enum(["light", "dark"]).default("light"),
    seed: z.number().int().optional(),
})

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
    if (renderedPhrase.right.length > 0) return "right"
    if (renderedPhrase.center.length > 0) return "center"
    return "left"
}

export function OpeningTextComposition({ theme = "light", seed }) {
    const frame = useCurrentFrame()
    const { width, height } = useVideoConfig()
    const [stableSeed] = useState(() => seed ?? Date.now())

    const themeStyle = THEME_STYLES[theme]
    const frameState = resolveOpeningFrameState(frame, stableSeed)
    const { scene, renderedPhrase, fadeProgress } = frameState
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
    const textMetrics = resolveOpeningLayoutMetrics({
        width,
        leftText: renderedPhrase.left,
        centerText: renderedPhrase.center,
        rightText: renderedPhrase.right,
        compact: scene.compact ?? false,
    })
    const lineCursorMetrics = {
        ...resolveTypewriterCursorMetrics(textMetrics.lineFontSize),
        opacity: cursorState.opacity,
    }
    const centerCursorMetrics = {
        ...resolveTypewriterCursorMetrics(textMetrics.centerFontSize),
        opacity: cursorState.opacity,
    }
    const overlayOpacity = 1 - fadeProgress

    return (
        <AbsoluteFill style={{ backgroundColor: themeStyle.pageBackground }}>
            <AbsoluteFill
                style={{
                    backgroundColor: themeStyle.maskBackground,
                    color: themeStyle.textColor,
                    opacity: overlayOpacity,
                }}
            >
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
                        {renderedPhrase.lineText}
                    </SingleLineText>
                ) : (
                    <>
                        <ColumnText
                            align="right"
                            style={{
                                fontFamily: leftTypography.fontFamily,
                                left: textMetrics.outerPadding,
                                width: textMetrics.sideWidth,
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
                                left: "50%",
                                transform: "translate(-50%, -50%)",
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
                                left: width - textMetrics.outerPadding - textMetrics.sideWidth,
                                width: textMetrics.sideWidth,
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
