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
        id: "ocean-deep",
        name: "Ocean Deep",
        bg: "#0A2540",
        accent: "#EAF4FF",
    },
    {
        id: "royal-indigo",
        name: "Royal Indigo",
        bg: "#3F3D9A",
        accent: "#F3EEFF",
    },
    {
        id: "warm-sand",
        name: "Warm Sand",
        bg: "#F4EDE4",
        accent: "#2B2A28",
    },
    {
        id: "teal-night",
        name: "Teal Night",
        bg: "#0F3D3E",
        accent: "#D9FFF8",
    },
]

export const DEFAULT_PALETTE = PALETTE_PRESETS[0]
