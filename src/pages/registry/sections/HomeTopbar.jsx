/**
 * [INPUT]: 依赖 @/components/ui/kumo(LinkButton), @/components/icons/BrandLogos, @/data/social-links, LanguageSelect, @/lib/utils(cn)
 * [OUTPUT]: 对外提供 HomeTopbar 顶部栏（支持 hideLanguage，按侧栏状态隐藏左侧语言切换）
 * [POS]: pages/registry/sections 的顶栏区域，承载语言切换与右上角社交入口（GitHub + 小红书）
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { LinkButton } from "@/components/ui/kumo"
import { GitHubInvertocatLogo, XiaohongshuLogo } from "@/components/icons/BrandLogos"
import { SOCIAL_LINKS } from "@/data/social-links"
import { cn } from "@/lib/utils"
import { LanguageSelect } from "./LanguageSelect"

const SOCIAL_ICON_MAP = {
    github: GitHubInvertocatLogo,
    xiaohongshu: XiaohongshuLogo,
}
const TOPBAR_SOCIAL_ORDER = ["xiaohongshu", "github"]

function HomeTopbar({ hideLanguage = false }) {
    const orderedSocialLinks = TOPBAR_SOCIAL_ORDER
        .map((id) => SOCIAL_LINKS.find((item) => item.id === id))
        .filter(Boolean)

    return (
        <header className="sticky top-0 z-10 border-b border-kumo-line bg-kumo-elevated md:pr-12">
            <div className="mx-auto hidden h-12 items-center px-4 md:flex md:border-r md:border-kumo-line">
                <div className={cn("transition-opacity duration-150", hideLanguage && "pointer-events-none opacity-0")}>
                    <LanguageSelect />
                </div>
                <div className="ml-auto flex items-center gap-0.5">
                    {orderedSocialLinks.map((social) => {
                        const Icon = SOCIAL_ICON_MAP[social.id]
                        const isXiaohongshu = social.id === "xiaohongshu"
                        const isGithub = social.id === "github"
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
                                        ? "h-9 px-2.5"
                                        : isGithub
                                            ? "md:-mr-2.5"
                                        : undefined
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

export { HomeTopbar }
