/**
 * [INPUT]: 依赖 Kumo Select 组件、languageOptions 与 config.wallpaperLang/actions.setWallpaperLang
 * [OUTPUT]: 对外提供 wallpaperLangCard 定义（Wallpaper Language 业务卡）
 * [POS]: workspace/cards 的第②卡业务实现，承接壁纸语言选择
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { Select } from "@/components/ui/kumo"

const wallpaperLangCard = {
    titleKey: "config.wallpaperLang",
    render: ({ actions, config, languageOptions }) => (
        <Select
            className="w-[200px] max-w-full"
            value={config.wallpaperLang}
            onValueChange={(value) => {
                if (value) actions.setWallpaperLang(value)
            }}
            renderValue={(value) => {
                const option = languageOptions.find((item) => item.value === value)
                if (!option) return "🇺🇸 English"
                return (
                    <span className="inline-flex items-center gap-1.5">
                        <span className="leading-none">{option.flag}</span>
                        <span className="leading-none">{option.name}</span>
                    </span>
                )
            }}
        >
            {languageOptions.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                    <span className="inline-flex items-center gap-1.5">
                        <span className="leading-none">{option.flag}</span>
                        <span className="leading-none">{option.name}</span>
                    </span>
                </Select.Option>
            ))}
        </Select>
    ),
}

export { wallpaperLangCard }
