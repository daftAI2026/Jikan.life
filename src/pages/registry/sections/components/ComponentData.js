/**
 * [INPUT]: 无
 * [OUTPUT]: 导出组件网格条目列表
 * [POS]: registry/sections/components 的静态数据源
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const COMPONENT_GRID_ITEMS = [
    { id: "button", title: "Button" },
    { id: "input", title: "Input" },
    { id: "select", title: "Select" },
    { id: "combobox", title: "Combobox" },
    { id: "switch", title: "Switch" },
    { id: "input-validation", title: "Input (with validation)" },
    { id: "dialog", title: "Dialog" },
    { id: "tooltip", title: "Tooltip" },
    { id: "dropdown", title: "Dropdown" },
    { id: "collapsible", title: "Collapsible" },
    { id: "checkbox", title: "Checkbox" },
    { id: "layer-card", title: "LayerCard" },
]

export { COMPONENT_GRID_ITEMS }
