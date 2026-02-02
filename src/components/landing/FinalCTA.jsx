/**
 * [INPUT]: 依赖 framer-motion, lucide-react, @/components/ui/ (Button)
 * [OUTPUT]: Final CTA Section (Apple Spring 动效)
 * [POS]: Landing 终结层 - 优雅 Spring 进场
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { motion } from "framer-motion"
import { ArrowRight, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { fadeInUp, staggerContainer, viewportConfig, scaleIn, pulseAnimation } from "@/lib/motion"

export function FinalCTA() {
    return (
        <section className="py-20 md:py-28 relative overflow-hidden">
            {/* Background */}
            <div
                className="absolute inset-0 -z-10"
                style={{
                    background: `linear-gradient(135deg, 
            color-mix(in srgb, var(--primary) 10%, transparent) 0%, 
            color-mix(in srgb, var(--accent) 10%, transparent) 50%,
            color-mix(in srgb, var(--primary) 5%, transparent) 100%
          )`
                }}
            />

            {/* Decorative Elements */}
            <motion.div
                className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
                animate={pulseAnimation}
            />
            <motion.div
                className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
                animate={{
                    ...pulseAnimation,
                    transition: { ...pulseAnimation.transition, delay: 1 }
                }}
            />

            <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportConfig}
                    className="text-center space-y-8"
                >
                    <motion.h2
                        variants={fadeInUp}
                        className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight"
                    >
                        准备好让每一天
                        <br />
                        <motion.span
                            className="text-primary inline-block"
                            variants={scaleIn}
                        >
                            都有意义
                        </motion.span>
                        了吗？
                    </motion.h2>

                    <motion.p
                        variants={fadeInUp}
                        className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
                    >
                        立即开始创建你的专属时间墙纸，让每次点亮屏幕都成为对生命的致敬。
                    </motion.p>

                    <motion.div
                        variants={fadeInUp}
                        className="flex flex-wrap items-center justify-center gap-4"
                    >
                        <Button size="xl" rightIcon={<ArrowRight className="h-5 w-5" />}>
                            立即定制墙纸
                        </Button>
                        <Button
                            variant="outline"
                            size="xl"
                            leftIcon={<Github className="h-5 w-5" />}
                            asChild
                        >
                            <a href="https://github.com/nicholasxuu/LifeProgressWidget" target="_blank" rel="noreferrer">
                                Star on GitHub
                            </a>
                        </Button>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
