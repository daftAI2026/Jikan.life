/**
 * [INPUT]: 依赖 lucide-react, react-router-dom (Link), @/lib/I18nContext
 * [OUTPUT]: Landing Footer 组件 (+ i18n)
 * [POS]: Landing 底部层 - 站点导航、法律信息、社交链接
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { Link } from "react-router-dom"
import { Github, Twitter, Heart, LayoutGrid } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useI18n } from "@/lib/I18nContext"

const SOCIAL_LINKS = [
    { icon: Github, href: "https://github.com/daftAI2026/Jikan.life", label: "GitHub" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
]

export function LandingFooter() {
    const { t } = useI18n()

    const FOOTER_LINKS = [
        {
            title: t('footer.product'),
            links: [
                { label: t('footer.features'), href: "#features" },
                { label: t('footer.pricing'), href: "#pricing" },
                { label: t('footer.changelog'), href: "/changelog" },
            ]
        },
        {
            title: t('footer.resources'),
            links: [
                { label: t('footer.docs'), href: "/docs" },
                { label: t('footer.design'), href: "/design" },
                { label: "GitHub", href: "https://github.com/daftAI2026/Jikan.life" },
            ]
        },
        {
            title: t('footer.about'),
            links: [
                { label: t('footer.license'), href: "/license" },
                { label: t('footer.privacy'), href: "/privacy" },
                { label: t('footer.terms'), href: "/terms" },
            ]
        }
    ]

    return (
        <footer className="w-full border-t bg-background py-12 md:py-16">
            <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                    <div className="col-span-2 md:col-span-1 space-y-4">
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                <LayoutGrid className="size-4" />
                            </div>
                            <h3 className="text-xl font-bold">JIKAN</h3>
                        </Link>
                        <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} JIKAN. All rights reserved.</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">{t('footer.tagline')}</p>
                    </div>

                    {FOOTER_LINKS.map((column) => (
                        <div key={column.title} className="space-y-4">
                            <h3 className="font-semibold">{column.title}</h3>
                            <ul className="space-y-3">
                                {column.links.map((link) => (
                                    <li key={link.label}>
                                        {link.href.startsWith("http") ? (
                                            <a href={link.href} target="_blank" rel="noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{link.label}</a>
                                        ) : (
                                            <Link to={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{link.label}</Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <Separator className="my-8" />

                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                        &copy; {new Date().getFullYear()} JIKAN. Built with <Heart className="h-3 w-3 fill-primary text-primary" /> for life.
                    </p>
                    <div className="flex items-center gap-4">
                        {SOCIAL_LINKS.map((social) => (
                            <a key={social.label} href={social.href} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label={social.label}>
                                <social.icon className="h-5 w-5" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}
