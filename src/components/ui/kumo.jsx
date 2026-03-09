/**
 * [INPUT]: 依赖 @cloudflare/kumo 根导出与 @/components/ui/input
 * [OUTPUT]: 对外提供 Registry 页面层统一 UI 入口（Button/LinkButton/Input/Select/DatePicker/Text/Surface/Badge/Banner/Dialog/Tooltip/TooltipProvider/Switch/Checkbox/Collapsible/Combobox/DropdownMenu/LayerCard/ClipboardText/SkeletonLine/Tabs）
 * [POS]: components/ui 的聚合导出层，供 pages 层统一引用，避免页面直接 import @cloudflare/kumo；Input 统一走本地可访问性包装层
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
    DatePicker,
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
