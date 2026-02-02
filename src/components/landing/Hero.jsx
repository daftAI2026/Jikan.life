/**
 * [INPUT]: 依赖 framer-motion, lucide-react, @/lib/motion, @/components/ui/button, @/lib/I18nContext
 * [OUTPUT]: Hero Section 组件 (原项目风格 + Framer Motion + i18n)
 * [POS]: Landing 核心 - Above the Fold 首屏，动画网格背景
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowDown } from "lucide-react"
import {
    fadeInUp,
    staggerContainer,
} from "@/lib/motion"
import { useI18n } from "@/lib/I18nContext"

export function Hero() {
    const { t } = useI18n()

    // 生成 12 个网格单元的延迟
    const gridCells = Array.from({ length: 12 }, (_, i) => ({
        delay: i,
        filled: [3, 4, 6, 9, 11].includes(i) // 原项目的 filled 位置
    }))

    return (
        <header className="hero">
            {/* Background Gradient */}
            <div
                className="absolute inset-0 -z-10"
                style={{
                    background: `radial-gradient(ellipse 80% 50% at 50% -20%, color-mix(in srgb, var(--primary) 15%, transparent), transparent)`
                }}
            />

            {/* Hero Content */}
            <motion.div
                className="hero-content"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
            >
                <motion.p
                    className="hero-eyebrow"
                    variants={fadeInUp}
                >
                    {t('hero.eyebrow')}
                </motion.p>

                <motion.h1
                    className="hero-title"
                    variants={fadeInUp}
                >
                    {t('hero.title')}<br />
                    <span className="hero-title-accent">{t('hero.titleAccent')}</span>
                </motion.h1>

                <motion.p
                    className="hero-subtitle"
                    variants={fadeInUp}
                >
                    {t('hero.subtitle')}
                </motion.p>

                <motion.div variants={fadeInUp}>
                    <Button
                        asChild
                        className="hero-cta font-semibold rounded-2xl h-14 px-8 text-lg hover:translate-y-[-2px] hover:shadow-xl transition-all"
                    >
                        <a href="#types">
                            <span>{t('hero.cta')}</span>
                            <ArrowDown className="ml-2 h-5 w-5 animate-bounce" />
                        </a>
                    </Button>
                </motion.div>
            </motion.div>

            {/* Animated Grid Background */}
            <div className="hero-grid">
                {gridCells.map((cell, index) => (
                    <div
                        key={index}
                        className={`grid-cell ${cell.filled ? 'filled' : ''}`}
                        style={{ '--delay': cell.delay }}
                    />
                ))}
            </div>
        </header>
    )
}
