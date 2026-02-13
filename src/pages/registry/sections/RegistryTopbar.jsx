/**
 * [INPUT]: 依赖 @cloudflare/kumo(LinkButton), @/components/icons/BrandLogos, @/data/social-links, LanguageSelect
 * [OUTPUT]: 对外提供 RegistryTopbar 顶部栏（左侧语言切换 + 右侧社交入口）
 * [POS]: pages/registry/sections 的顶栏区域，承载语言切换与右上角社交入口（GitHub + 小红书）
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { LinkButton } from "@cloudflare/kumo"
import { GitHubInvertocatLogo, XiaohongshuLogo } from "@/components/icons/BrandLogos"
import { SOCIAL_LINKS } from "@/data/social-links"
import { LanguageSelect } from "./LanguageSelect"

const SOCIAL_ICON_MAP = {
    github: GitHubInvertocatLogo,
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
                <div className="ml-auto flex items-center gap-0.5">
                    {orderedSocialLinks.map((social) => {
                        const Icon = SOCIAL_ICON_MAP[social.id]
                        const isXiaohongshu = social.id === "xiaohongshu"
                        if (!Icon) return null

                        return (
                            <LinkButton
                                key={social.id}
                                href={social.href}
                                external
                                aria-label={social.label}
                                variant="ghost"
                                shape={isXiaohongshu ? "base" : "square"}
                                className={
                                    isXiaohongshu
                                        ? "h-9 px-2.5 text-kumo-subtle hover:text-kumo-default"
                                        : "text-kumo-subtle hover:text-kumo-default"
                                }
                            >
                                <Icon className={social.className} />
                            </LinkButton>
                        )
                    })}
                </div>
            </div>
        </header>
    )
}

export { RegistryTopbar }
