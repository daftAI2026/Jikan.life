/**
 * [INPUT]: 无 (纯数据)
 * [OUTPUT]: 导出 PALETTE_PRESETS 与 DEFAULT_PALETTE
 * [POS]: shared/ 共享配色预设，前后端统一读取入口
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

/* ========================================================================
   Shared Palette Presets
   ======================================================================== */

export const PALETTE_PRESETS = [
    {
        id: "mono-dark",
        name: "Mono Dark",
        bg: "#000000",
        accent: "#FFFFFF",
    },
    {
        id: "mono-light",
        name: "Mono Light",
        bg: "#FFFFFF",
        accent: "#000000",
    },
    {
        id: "system-red",
        name: "System Red",
        bg: "#FF3B30",
        accent: "#FFFFFF",
    },
    {
        id: "system-green",
        name: "System Green",
        bg: "#34C759",
        accent: "#FFFFFF",
    },
    {
        id: "system-blue",
        name: "System Blue",
        bg: "#007AFF",
        accent: "#FFFFFF",
    },
    {
        id: "system-indigo",
        name: "System Indigo",
        bg: "#5856D6",
        accent: "#FFFFFF",
    },
    {
        id: "system-warm",
        name: "System Warm",
        bg: "#f5f5f7",
        accent: "#1d1d1f",
    },
]

export const DEFAULT_PALETTE = PALETTE_PRESETS[0]
