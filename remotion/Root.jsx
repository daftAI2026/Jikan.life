/**
 * [INPUT]: 依赖 remotion、./OpeningTextComposition.jsx 与 ./opening-timeline.js
 * [OUTPUT]: 对外提供 RemotionRoot 组合树
 * [POS]: remotion/ 的组合注册表，被 Remotion Studio 加载
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import React from "react"
import { Composition, Folder } from "remotion"
import { OpeningTextComposition, OpeningTextCompositionSchema } from "./OpeningTextComposition.jsx"
import {
    OPENING_DURATION_IN_FRAMES,
    OPENING_FPS,
    OPENING_HEIGHT,
    OPENING_WIDTH,
} from "./opening-timeline.js"

export function RemotionRoot() {
    return (
        <Folder name="opening">
            <Composition
                id="OpeningTextAnimation"
                component={OpeningTextComposition}
                durationInFrames={OPENING_DURATION_IN_FRAMES}
                fps={OPENING_FPS}
                width={OPENING_WIDTH}
                height={OPENING_HEIGHT}
                defaultProps={{ theme: "light", debugLayout: true }}
                schema={OpeningTextCompositionSchema}
            />
        </Folder>
    )
}
