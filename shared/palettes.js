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
        id: "preset-1",
        name: "预设 1",
        kind: "static",
        bg: "#000000",
        accent: "#FFFFFF",
    },
    {
        id: "preset-2",
        name: "预设 2",
        kind: "static",
        bg: "#FFFFFF",
        accent: "#000000",
    },
    {
        id: "preset-3",
        name: "预设 3",
        kind: "static",
        bg: "#A6094B",
        accent: "#EDD00F",
    },
    {
        id: "preset-4",
        name: "预设 4",
        kind: "static",
        bg: "#3FE345",
        accent: "#470FD6",
    },
    {
        id: "preset-5",
        name: "预设 5",
        kind: "static",
        bg: "#562F99",
        accent: "#EACA6C",
    },
    {
        id: "preset-6",
        name: "预设 6",
        kind: "static",
        bg: "#20BDEB",
        accent: "#161CB1",
    },
    {
        id: "preset-7",
        name: "预设 7",
        kind: "static",
        bg: "#F8FA5A",
        accent: "#4D370C",
    },
    {
        id: "preset-8",
        name: "预设 8",
        kind: "random",
        bg: "#0F3D3E",
        accent: "#D9FFF8",
    },
]

export const DEFAULT_PALETTE = PALETTE_PRESETS[0]
