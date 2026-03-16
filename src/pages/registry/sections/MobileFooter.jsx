/**
 * [INPUT]: 依赖 @/components/ui/kumo(LinkButton), @/components/icons/BrandLogos, @/data/social-links, LanguageSelect 与 @/lib/utils(cn)
 * [OUTPUT]: 对外提供 MobileFooter 组件（默认渲染左 GitHub / 中语言切换 / 右小红书，并支持 fixed/className 复用为内联 footer）
 * [POS]: pages/registry/sections 的移动端底栏容器，复用 Header 的 px-3 边线锚定形成左右对齐；默认提供全局 footer，也可作为 sidebar tabs 下方的真实 footer
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { LinkButton } from "@/components/ui/kumo"
import { GitHubInvertocatLogo, XiaohongshuLogo } from "@/components/icons/BrandLogos"
import { SOCIAL_LINKS } from "@/data/social-links"
import { cn } from "@/lib/utils"
import { LanguageSelect } from "./LanguageSelect"

const MOBILE_FOOTER_SOCIAL_ORDER = ["github", "xiaohongshu"]
const MOBILE_FOOTER_SOCIAL_LINKS = Object.fromEntries(
    MOBILE_FOOTER_SOCIAL_ORDER.map((id) => [id, SOCIAL_LINKS.find((item) => item.id === id) ?? null])
)

function MobileFooter({ className, fixed = true }) {
    const mobileGithub = MOBILE_FOOTER_SOCIAL_LINKS.github
    const mobileXiaohongshu = MOBILE_FOOTER_SOCIAL_LINKS.xiaohongshu
    const footerClassName = cn(
        "pointer-events-auto flex h-[var(--registry-topbar-height)] items-center border-t border-kumo-line bg-kumo-elevated md:hidden",
        fixed ? "fixed inset-x-0 bottom-0 z-50" : null,
        className
    )

    return (
        <footer className={footerClassName}>
            <div className="relative h-full w-full">
                <div className="absolute inset-y-0 left-0 flex items-center px-3">
                    <LanguageSelect />
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
                </div>
            </div>
        </footer>
    )
}

export { MobileFooter }
