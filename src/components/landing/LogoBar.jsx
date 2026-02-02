/**
 * [INPUT]: 依赖 framer-motion
 * [OUTPUT]: Logo Trust Bar 组件
 * [POS]: Landing 信任层 - 展示合作伙伴/媒体 Logo
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { motion } from "framer-motion"
import { fadeInUp, staggerContainer, viewportConfig } from "@/lib/motion"

const LOGOS = [
    { name: "Apple", icon: "🍎" },
    { name: "Google", icon: "🔍" },
    { name: "Microsoft", icon: "🪟" },
    { name: "Amazon", icon: "📦" },
    { name: "Meta", icon: "♾️" },
]

export function LogoBar() {
    return (
        <section className="py-12 border-y bg-muted/30">
            <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportConfig}
                    className="space-y-8"
                >
                    <motion.p
                        variants={fadeInUp}
                        className="text-center text-sm text-muted-foreground"
                    >
                        受到全球顶尖开发者信赖
                    </motion.p>

                    <motion.div
                        variants={fadeInUp}
                        className="flex flex-wrap justify-center items-center gap-8 md:gap-12"
                    >
                        {LOGOS.map((logo) => (
                            <div
                                key={logo.name}
                                className="flex items-center gap-2 text-muted-foreground/60 hover:text-foreground transition-colors duration-300 cursor-pointer"
                            >
                                <span className="text-2xl grayscale hover:grayscale-0 transition-all duration-300">
                                    {logo.icon}
                                </span>
                                <span className="font-semibold text-lg hidden sm:inline">
                                    {logo.name}
                                </span>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
