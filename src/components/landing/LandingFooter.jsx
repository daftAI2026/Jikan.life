/**
 * [INPUT]: 依赖 lucide-react, react-router-dom (Link)
 * [OUTPUT]: Landing Footer 组件
 * [POS]: Landing 底部层 - 站点导航、法律信息、社交链接
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { Link } from "react-router-dom"
import { Github, Twitter, Heart, LayoutGrid } from "lucide-react"
import { Separator } from "@/components/ui/separator"

const FOOTER_LINKS = [
    {
        title: "产品",
        links: [
            { label: "功能特性", href: "#features" },
            { label: "定价方案", href: "#pricing" },
            { label: "更新日志", href: "/changelog" },
        ]
    },
    {
        title: "资源",
        links: [
            { label: "使用文档", href: "/docs" },
            { label: "设计系统", href: "/design" },
            { label: "GitHub", href: "https://github.com/daftAI2026/Jikan.life" },
        ]
    },
    {
        title: "关于",
        links: [
            { label: "开源协议", href: "/license" },
            { label: "隐私政策", href: "/privacy" },
            { label: "服务条款", href: "/terms" },
        ]
    }
]

const SOCIAL_LINKS = [
    { icon: Github, href: "https://github.com/daftAI2026/Jikan.life", label: "GitHub" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
]

export function LandingFooter() {
    return (
        <footer className="w-full border-t bg-background py-12 md:py-16">
            <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                    {/* Brand Column */}
                    <div className="col-span-2 md:col-span-1 space-y-4">
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                <LayoutGrid className="size-4" />
                            </div>
                            <h3 className="text-xl font-bold">JIKAN</h3>
                        </Link>
                        <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} JIKAN. All rights reserved.</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            人生不只是格子。
                            <br />
                            让时间可视化，让每天都有意义。
                        </p>
                    </div>

                    {/* Link Columns */}
                    {FOOTER_LINKS.map((column) => (
                        <div key={column.title} className="space-y-4">
                            <h3 className="font-semibold">{column.title}</h3>
                            <ul className="space-y-3">
                                {column.links.map((link) => (
                                    <li key={link.label}>
                                        {link.href.startsWith("http") ? (
                                            <a
                                                href={link.href}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                {link.label}
                                            </a>
                                        ) : (
                                            <Link
                                                to={link.href}
                                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                {link.label}
                                            </Link>
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
                        &copy; {new Date().getFullYear()} JIKAN. Built with
                        <Heart className="h-3 w-3 fill-primary text-primary" />
                        by Antigravity. Apache-2.0 Licensed.
                    </p>

                    <div className="flex items-center gap-4">
                        {SOCIAL_LINKS.map((social) => (
                            <a
                                key={social.label}
                                href={social.href}
                                target="_blank"
                                rel="noreferrer"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                                aria-label={social.label}
                            >
                                <social.icon className="h-5 w-5" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}
