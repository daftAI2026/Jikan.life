/**
 * [INPUT]: 无外部依赖（纯函数进度环几何）
 * [OUTPUT]: 对外提供 GOAL_RING_START_ANGLE_RADIANS/getGoalRingGeometry，统一 Goal 圆环的可见性、满圆态与绘制参数
 * [POS]: shared/ Goal 圆环几何真相源，供 choose 卡、Canvas 预览与 Worker SVG 共享
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const TAU = Math.PI * 2
export const GOAL_RING_START_ANGLE_RADIANS = -Math.PI / 2

function clampProgress(progress) {
    if (!Number.isFinite(progress)) return 0
    return Math.min(1, Math.max(0, progress))
}

export function getGoalRingGeometry(progress = 0) {
    const normalizedProgress = clampProgress(progress)
    const sweepRadians = TAU * normalizedProgress

    return {
        progress: normalizedProgress,
        isVisible: normalizedProgress > 0,
        isFullRing: normalizedProgress >= 1,
        startAngleRadians: GOAL_RING_START_ANGLE_RADIANS,
        endAngleRadians: GOAL_RING_START_ANGLE_RADIANS + sweepRadians,
        sweepDegrees: normalizedProgress * 360,
        strokeDashoffsetRatio: 1 - normalizedProgress,
    }
}
