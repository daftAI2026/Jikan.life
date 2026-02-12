/**
 * [INPUT]: 依赖 @cloudflare/kumo(Select), @phosphor-icons/react(Globe), @/lib/I18nContext(useI18n), @/data/i18n(LANGUAGE_META)
 * [OUTPUT]: 对外提供 LanguageSelect 组件（Registry 桌面顶栏左侧 + 移动端右下角 UI 语言切换）
 * [POS]: pages/registry/sections 的全局语言入口，触发器采用 ThemeToggle 同款 ghost 手感，菜单与触发器统一图标间距并对齐左边缘，独立于壁纸语言配置
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { useEffect, useMemo, useState } from "react"
import { Select } from "@cloudflare/kumo"
import { Globe } from "@phosphor-icons/react"
import { useI18n } from "@/lib/I18nContext"
import { LANGUAGE_META } from "@/data/i18n"

function LanguageSelect() {
    const { lang, setLanguage, t } = useI18n()
    const [isOpen, setIsOpen] = useState(false)

    const languageOptions = useMemo(
        () =>
            LANGUAGE_META.map((meta) => {
                const label = t(meta.labelKey)
                return {
                    value: meta.code,
                    triggerLabel: label,
                    menuFlag: meta.flag,
                    menuLabel: label,
                }
            }),
        [t]
    )
    const fallbackTriggerLabel = useMemo(() => t(LANGUAGE_META[0].labelKey), [t])

    useEffect(() => {
        const className = "registry-language-select-open"
        document.body.classList.toggle(className, isOpen)
        return () => {
            document.body.classList.remove(className)
        }
    }, [isOpen])

    return (
        <Select
            className="min-w-[104px] justify-start gap-1.5 bg-inherit px-2 text-kumo-default shadow-none ring-0 hover:bg-kumo-tint not-disabled:hover:!bg-kumo-tint data-[state=open]:bg-kumo-tint md:-ml-2.5 [&>span:first-child]:flex [&>span:first-child]:h-full [&>span:first-child]:items-center [&>*:last-child]:hidden"
            value={lang}
            onOpenChange={(open) => setIsOpen(Boolean(open))}
            onValueChange={(value) => {
                if (value) setLanguage(String(value))
            }}
            renderValue={(value) => {
                const option = languageOptions.find((item) => item.value === value)
                return (
                    <span className="inline-flex items-center gap-1.5">
                        <Globe size={16} aria-hidden="true" />
                        <span className="leading-none">{option?.triggerLabel ?? fallbackTriggerLabel}</span>
                    </span>
                )
            }}
            aria-label={t("lang.select")}
        >
            {languageOptions.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                    <span className="inline-flex items-center gap-1.5">
                        <span className="leading-none">{option.menuFlag}</span>
                        <span className="leading-none">{option.menuLabel}</span>
                    </span>
                </Select.Option>
            ))}
        </Select>
    )
}

export { LanguageSelect }
