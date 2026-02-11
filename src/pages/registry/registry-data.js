/**
 * [INPUT]: 无
 * [OUTPUT]: 导出 Registry 页面导航与示例数据
 * [POS]: pages/registry 的数据配置层，被各 Section 复用
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const TOP_NAV = [
    { label: "Home", href: "#" },
    { label: "Installation", href: "#installation" },
    { label: "Contributing", href: "#contributing" },
    { label: "Colors", href: "#colors" },
    { label: "Accessibility", href: "#accessibility" },
    { label: "Figma Resources", href: "#figma-resources" },
    { label: "CLI", href: "#cli" },
    { label: "Registry", href: "#registry" },
]

const COMPONENT_SECTIONS = [
    { id: "badge", title: "Badge", description: "Badge component" },
    { id: "banner", title: "Banner", description: "Banner component" },
    { id: "breadcrumbs", title: "Breadcrumbs", description: "Breadcrumbs component" },
    { id: "button", title: "Button", description: "Button component" },
    { id: "checkbox", title: "Checkbox", description: "Checkbox component" },
    { id: "clipboard-text", title: "Clipboard Text", description: "ClipboardText component" },
    { id: "code", title: "Code", description: "Code block component" },
    { id: "collapsible", title: "Collapsible", description: "Collapsible component" },
    { id: "combobox", title: "Combobox", description: "Combobox component" },
    { id: "command-palette", title: "Command Palette", description: "Command palette component" },
    { id: "date-range-picker", title: "Date Range Picker", description: "Date range picker" },
    { id: "dialog", title: "Dialog", description: "Dialog component" },
    { id: "dropdown", title: "Dropdown", description: "Dropdown menu component" },
    { id: "empty", title: "Empty", description: "Empty state component" },
    { id: "grid", title: "Grid", description: "Grid component" },
    { id: "input", title: "Input", description: "Input component" },
    { id: "input-validation", title: "Input with validation", description: "Input + Field validation" },
    { id: "layer-card", title: "LayerCard", description: "LayerCard component" },
    { id: "loader", title: "Loader", description: "Loader component" },
    { id: "meter", title: "Meter", description: "Meter component" },
]

const BLOCK_SECTIONS = [
    { id: "page-header", title: "Page Header", description: "Page header block" },
    { id: "resource-list", title: "Resource List", description: "Resource list block" },
]

const SIDEBAR_SECTIONS = [
    {
        label: "Components",
        items: COMPONENT_SECTIONS.map((item) => ({ label: item.title, href: `#${item.id}` })),
    },
]

const EMAIL_ROWS = [
    { id: 1, subject: "Welcome to Kumo", from: "Cloudflare", date: "Today" },
    { id: 2, subject: "Your deployment is ready", from: "CI Bot", date: "Yesterday" },
    { id: 3, subject: "New changelog available", from: "Release", date: "2 days ago" },
]

const RESOURCE_ITEMS = [
    { name: "edge-api", status: "Active", usage: "1.2M requests" },
    { name: "image-optimizer", status: "Active", usage: "680k requests" },
    { name: "auth-gateway", status: "Paused", usage: "0 requests" },
]

export {
    TOP_NAV,
    COMPONENT_SECTIONS,
    BLOCK_SECTIONS,
    SIDEBAR_SECTIONS,
    EMAIL_ROWS,
    RESOURCE_ITEMS,
}
