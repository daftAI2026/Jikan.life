/**
 * [INPUT]: 依赖 @cloudflare/kumo 根导出、@/components/ui/input、@/components/ui/vendor/kumo-date-picker
 * [OUTPUT]: 对外提供 Registry 页面层统一 UI 入口（Button/LinkButton/Input/Select/DatePicker/Text/Surface/Badge/Banner/Dialog/Tooltip/TooltipProvider/Switch/Checkbox/Collapsible/Combobox/DropdownMenu/LayerCard/ClipboardText/SkeletonLine/Tabs）
 * [POS]: components/ui 的聚合导出层，供 pages 层统一引用，避免页面直接 import @cloudflare/kumo；Input 统一走本地可访问性包装层，DatePicker 由本地 vendor 桥接 restart range 能力
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
export {
    Badge,
    Banner,
    Button,
    Checkbox,
    ClipboardText,
    Collapsible,
    Combobox,
    Dialog,
    DropdownMenu,
    LayerCard,
    LinkButton,
    Select,
    SkeletonLine,
    Surface,
    Switch,
    Tabs,
    Text,
    Tooltip,
    TooltipProvider,
    useKumoToastManager,
} from "@cloudflare/kumo"

export { Input } from "@/components/ui/input"
export { DatePicker } from "@/components/ui/vendor/kumo-date-picker"
