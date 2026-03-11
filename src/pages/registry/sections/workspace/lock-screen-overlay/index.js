/**
 * [INPUT]: 依赖 lock-screen-overlay 子模块内部的组件与常量文件
 * [OUTPUT]: 对外提供 LockScreenDarkOverlay、LOCK_SCREEN_DARK_OVERLAY_LAYER_IDS、LOCK_SCREEN_DARK_OVERLAY_DEFAULT_COLORS
 * [POS]: workspace/lock-screen-overlay 的聚合出口，避免上游跨文件直连内部实现
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
export { LockScreenDarkOverlay } from "./LockScreenDarkOverlay"
export {
    LOCK_SCREEN_DARK_OVERLAY_DEFAULT_COLORS,
    LOCK_SCREEN_DARK_OVERLAY_LAYER_IDS,
} from "./lock-screen-dark-overlay.constants"
