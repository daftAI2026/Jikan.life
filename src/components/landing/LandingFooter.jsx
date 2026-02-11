/**
 * [INPUT]: 依赖 @phosphor-icons/react (图标), @/components/icons/BrandLogos, @/data/social-links
 * [OUTPUT]: Landing Footer 组件
 * [POS]: Landing 底部层 - 极简版权信息 + 社交入口
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { Heart, GithubLogo } from "@phosphor-icons/react"
import { XiaohongshuLogo } from "@/components/icons/BrandLogos"
import { SOCIAL_LINKS } from "@/data/social-links"

const SOCIAL_ICON_MAP = {
    github: GithubLogo,
    xiaohongshu: XiaohongshuLogo,
}

export function LandingFooter() {
    return (
        <footer className="w-full border-t bg-background py-6 md:py-8">
            <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                        &copy; {new Date().getFullYear()} JIKAN. Built with <Heart className="h-3 w-3 fill-primary text-primary" /> for life.
                    </p>
                    <div className="flex items-center gap-4">
                        {SOCIAL_LINKS.map((social) => {
                            const Icon = SOCIAL_ICON_MAP[social.id]
                            if (!Icon) return null
                            return (
                                <a key={social.label} href={social.href} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label={social.label}>
                                    <Icon className={social.className} />
                                </a>
                            )
                        })}
                    </div>
                </div>
            </div>
        </footer>
    )
}
