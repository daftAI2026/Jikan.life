/**
 * [INPUT]: 依赖各业务卡定义(location/wallpaper-lang/goal/life/colors/device/url)
 * [OUTPUT]: 对外提供 CARD_REGISTRY（Setting Panel 业务语义层）
 * [POS]: workspace/cards 的聚合入口，供 HomeSettingsPane 以业务ID索引渲染
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { locationCard } from "./location-card"
import { wallpaperLangCard } from "./wallpaper-lang-card"
import { goalFieldsCard } from "./goal-fields-card"
import { lifeFieldsCard } from "./life-fields-card"
import { colorsCard } from "./colors-card"
import { deviceCard } from "./device-card"
import { urlCard } from "./url-card"

const CARD_REGISTRY = {
    location: locationCard,
    "wallpaper-lang": wallpaperLangCard,
    "goal-fields": goalFieldsCard,
    "life-fields": lifeFieldsCard,
    colors: colorsCard,
    device: deviceCard,
    url: urlCard,
}

export { CARD_REGISTRY }
