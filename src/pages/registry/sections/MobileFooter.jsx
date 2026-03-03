/**
 * [INPUT]: 依赖 @/components/ui/kumo(LinkButton), @/components/icons/BrandLogos, @/data/social-links, LanguageSelect
 * [OUTPUT]: 对外提供 MobileFooter 组件（仅移动端显示，左 GitHub / 中语言切换 / 右小红书）
 * [POS]: pages/registry/sections 的移动端底栏容器，复用 Header 的 px-3 边线锚定形成左右对齐，并为语言入口提供中置锚点
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { LinkButton } from "@/components/ui/kumo"
import { GitHubInvertocatLogo, XiaohongshuLogo } from "@/components/icons/BrandLogos"
import { SOCIAL_LINKS } from "@/data/social-links"
import { LanguageSelect } from "./LanguageSelect"

const MOBILE_FOOTER_SOCIAL_ORDER = ["github", "xiaohongshu"]
const MOBILE_FOOTER_SOCIAL_LINKS = Object.fromEntries(
    MOBILE_FOOTER_SOCIAL_ORDER.map((id) => [id, SOCIAL_LINKS.find((item) => item.id === id) ?? null])
)

function MobileFooter() {
    const mobileGithub = MOBILE_FOOTER_SOCIAL_LINKS.github
    const mobileXiaohongshu = MOBILE_FOOTER_SOCIAL_LINKS.xiaohongshu

    return (
        <footer className="pointer-events-auto fixed inset-x-0 bottom-0 z-50 flex h-[var(--registry-topbar-height)] items-center border-t border-kumo-line bg-kumo-elevated md:hidden">
            <div className="relative h-full w-full">
                <div className="absolute inset-y-0 left-0 flex items-center px-3">
                    {mobileGithub && (
                        <LinkButton
                            href={mobileGithub.href}
                            external
                            aria-label={mobileGithub.label}
                            variant="ghost"
                            shape="square"
                        >
                            <GitHubInvertocatLogo className={mobileGithub.className} />
                        </LinkButton>
                    )}
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center px-3">
                    {mobileXiaohongshu && (
                        <LinkButton
                            href={mobileXiaohongshu.href}
                            external
                            aria-label={mobileXiaohongshu.label}
                            variant="ghost"
                            shape="base"
                            className="h-9 px-2.5"
                        >
                            <XiaohongshuLogo className={mobileXiaohongshu.className} />
                        </LinkButton>
                    )}
                </div>
                <div className="pointer-events-none absolute inset-0 grid place-items-center">
                    <div className="pointer-events-auto">
                        <LanguageSelect />
                    </div>
                </div>
            </div>
        </footer>
    )
}

export { MobileFooter }
