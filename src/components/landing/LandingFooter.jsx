/**
 * [INPUT]: 依赖 lucide-react (图标), react-icons/si (品牌图标)
 * [OUTPUT]: Landing Footer 组件
 * [POS]: Landing 底部层 - 极简版权信息 + 社交入口
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { Heart } from "lucide-react"
import { SiGithub, SiXiaohongshu } from "react-icons/si"

const SOCIAL_LINKS = [
    { icon: SiGithub, href: "https://github.com/daftAI2026/Jikan.life", label: "GitHub", className: "size-5" },
    { icon: SiXiaohongshu, href: "https://www.xiaohongshu.com/user/profile/5f4696c800000000010011f6?xsec_token=ABdWCr27MLyMrcQicvc41Q6L70BC6otUUSq7zILtfu1vE=&xsec_source=pc_note", label: "Xiaohongshu", className: "size-9" },
]

export function LandingFooter() {
    return (
        <footer className="w-full border-t bg-background py-6 md:py-8">
            <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                        &copy; {new Date().getFullYear()} JIKAN. Built with <Heart className="h-3 w-3 fill-primary text-primary" /> for life.
                    </p>
                    <div className="flex items-center gap-4">
                        {SOCIAL_LINKS.map((social) => (
                            <a key={social.label} href={social.href} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label={social.label}>
                                <social.icon className={social.className} />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}
