/**
 * [INPUT]: 依赖 @phosphor-icons/react, react, @/components/ui/button, @/components/ui/dropdown-menu, @/lib/I18nContext
 * [OUTPUT]: 对外提供 Header 组件 (固定导航栏)
 * [POS]: 布局组件，全站顶部导航，三段式布局: Logo | 导航链接 | 工具栏
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { useState, useEffect } from "react"
import { GithubLogo, Sun, Moon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useI18n } from "@/lib/I18nContext"

const LANG_CONFIG = {
    'en': { flag: '🇺🇸', label: 'EN', name: 'English' },
    'zh-CN': { flag: '🇨🇳', label: 'CN', name: '简体中文' },
    'zh-TW': { flag: '🇨🇳', label: 'TW', name: '繁體中文' },
    'ja': { flag: '🇯🇵', label: 'JP', name: '日本語' },
}

export function Header() {
    const [mode, setMode] = useState(() => {
        if (typeof document === "undefined") {
            return "light"
        }
        const savedMode = localStorage.getItem("mode")
        return savedMode || document.documentElement.dataset.mode || "light"
    })
    const { lang, setLanguage, t } = useI18n()

    useEffect(() => {
        if (typeof document === "undefined") {
            return
        }
        document.documentElement.setAttribute("data-mode", mode)
        localStorage.setItem("mode", mode)
    }, [mode])

    const toggleTheme = () => {
        setMode((prevMode) => (prevMode === "dark" ? "light" : "dark"))
    }

    return (
        <nav className="nav">
            <div className="nav-content">
                {/* Left: Logo */}
                <a href="#" className="nav-logo">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <rect x="2" y="2" width="6" height="6" rx="1" fill="currentColor" />
                        <rect x="9" y="2" width="6" height="6" rx="1" fill="currentColor" opacity="0.5" />
                        <rect x="16" y="2" width="6" height="6" rx="1" fill="currentColor" opacity="0.3" />
                        <rect x="2" y="9" width="6" height="6" rx="1" fill="currentColor" opacity="0.5" />
                        <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor" />
                        <rect x="16" y="9" width="6" height="6" rx="1" fill="currentColor" opacity="0.5" />
                        <rect x="2" y="16" width="6" height="6" rx="1" fill="currentColor" opacity="0.3" />
                        <rect x="9" y="16" width="6" height="6" rx="1" fill="currentColor" opacity="0.5" />
                        <rect x="16" y="16" width="6" height="6" rx="1" fill="currentColor" />
                    </svg>
                    <span>{t('nav.title')}</span>
                </a>

                {/* Center: Navigation Links */}
                <div className="nav-center">
                    <Button variant="link" asChild className="text-muted-foreground hover:text-foreground">
                        <a href="#types">{t('nav.wallpapers')}</a>
                    </Button>
                    <Button variant="link" asChild className="text-muted-foreground hover:text-foreground">
                        <a href="#customize">{t('nav.customize')}</a>
                    </Button>
                    <Button variant="link" asChild className="text-muted-foreground hover:text-foreground">
                        <a href="#setup">{t('nav.setup')}</a>
                    </Button>
                </div>

                {/* Right: Tools (Theme + Language + GitHub) */}
                <div className="nav-tools">
                    {/* Theme Switcher */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        className="relative"
                    >
                        <Sun
                            weight="bold"
                            className={`h-[1.2rem] w-[1.2rem] transition-all ${mode === 'light' ? 'rotate-0 scale-100' : '-rotate-90 scale-0'}`}
                        />
                        <Moon
                            weight="bold"
                            className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${mode === 'dark' ? 'rotate-0 scale-100' : 'rotate-90 scale-0'}`}
                        />
                    </Button>

                    {/* Language Selector (DropdownMenu) */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="px-2 gap-2">
                                <span className="text-base leading-none">{LANG_CONFIG[lang]?.flag || '🇺🇸'}</span>
                                <span className="text-sm font-medium">{LANG_CONFIG[lang]?.label || 'EN'}</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {Object.entries(LANG_CONFIG).map(([code, config]) => (
                                <DropdownMenuItem
                                    key={code}
                                    onClick={() => setLanguage(code)}
                                    className="gap-2 cursor-pointer"
                                >
                                    <span className="text-base">{config.flag}</span>
                                    <span>{config.name}</span>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* GitHub Link */}
                    <Button variant="ghost" size="icon" asChild>
                        <a
                            href="https://github.com/daftAI2026/Jikan.life"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="JIKAN on GitHub"
                        >
                            <GithubLogo className="h-[1.2rem] w-[1.2rem]" weight="fill" />
                        </a>
                    </Button>
                </div>
            </div>
        </nav>
    )
}
