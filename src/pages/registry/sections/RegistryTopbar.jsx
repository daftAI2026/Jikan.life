/**
 * [INPUT]: 依赖 @phosphor-icons/react(GithubLogo), @/components/icons/BrandLogos, @/data/social-links, LanguageSelect
 * [OUTPUT]: 对外提供 RegistryTopbar 顶部栏（左侧语言切换 + 右侧社交入口）
 * [POS]: pages/registry/sections 的顶栏区域，承载语言切换与右上角社交入口（GitHub + 小红书）
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { GithubLogo } from "@phosphor-icons/react"
import { XiaohongshuLogo } from "@/components/icons/BrandLogos"
import { SOCIAL_LINKS } from "@/data/social-links"
import { LanguageSelect } from "./LanguageSelect"

const SOCIAL_ICON_MAP = {
    github: GithubLogo,
    xiaohongshu: XiaohongshuLogo,
}
const TOPBAR_SOCIAL_ORDER = ["xiaohongshu", "github"]

function RegistryTopbar() {
    const orderedSocialLinks = TOPBAR_SOCIAL_ORDER
        .map((id) => SOCIAL_LINKS.find((item) => item.id === id))
        .filter(Boolean)

    return (
        <header className="sticky top-0 z-10 border-b border-kumo-line bg-kumo-elevated md:pr-12">
            <div className="mx-auto hidden h-12 items-center px-4 md:flex md:border-r md:border-kumo-line">
                <LanguageSelect />
                <div className="ml-auto flex items-center gap-4">
                    {orderedSocialLinks.map((social) => {
                        const Icon = SOCIAL_ICON_MAP[social.id]
                        if (!Icon) return null

                        return (
                            <a
                                key={social.id}
                                href={social.href}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={social.label}
                                className="inline-flex items-center text-muted-foreground transition-colors hover:text-foreground"
                            >
                                <Icon
                                    className={social.className}
                                    weight={social.id === "github" ? "fill" : undefined}
                                />
                            </a>
                        )
                    })}
                </div>
            </div>
        </header>
    )
}

export { RegistryTopbar }
