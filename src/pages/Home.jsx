/**
 * [INPUT]: 依赖 framer-motion, @phosphor-icons/react, @/components/ui/ (button, card, badge)
 * [OUTPUT]: 对外提供 Home 页面组件
 * [POS]: 首页内容，包含 Hero 区域和功能亮点
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { motion } from "framer-motion"
import { Star, ArrowRight, DeviceMobile, Clock, Palette } from "@phosphor-icons/react"
import { Badge } from "@/components/ui/badge"
import { Button as ShadcnButton } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Home() {
    return (
        <div className="flex flex-col gap-20 pb-20">
            {/* Hero Section */}
            <section className="relative pt-20 md:pt-32">
                <div className="container px-4">
                    <div className="flex flex-col items-center text-center space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Badge variant="secondary" className="px-4 py-1.5 text-sm font-medium">
                                <Star className="mr-2 h-3.5 w-3.5 text-primary" />
                                Vite + React + Tailwind v4 强力驱动
                            </Badge>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-5xl md:text-8xl font-black tracking-tight balance leading-[1.1]"
                        >
                            让人生进度 <br />
                            <span className="text-primary italic">跃然屏上</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-xl text-muted-foreground max-w-[600px] leading-relaxed"
                        >
                            动态生成属于你的 365 天进度、人生网格或倒计时目标。
                            极精致简，让每一次点亮屏幕都成为对时间的温柔提醒。
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-wrap items-center justify-center gap-4"
                        >
                            <ShadcnButton size="lg" className="rounded-full px-8 h-14 text-lg font-bold">
                                立即定制 <ArrowRight className="ml-2 h-5 w-5" />
                            </ShadcnButton>
                            <ShadcnButton variant="outline" size="lg" className="rounded-full px-8 h-14 text-lg">
                                查看模版
                            </ShadcnButton>
                        </motion.div>
                    </div>
                </div>

                {/* Background Decoration */}
                <div className="absolute top-0 left-1/2 -z-10 h-[600px] w-full -translate-x-1/2 bg-[radial-gradient(circle_at_center,var(--primary)_0%,transparent_70%)] opacity-20 blur-3xl" />
            </section>

            {/* Feature Section */}
            <section className="container px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        {
                            icon: <DeviceMobile className="h-6 w-6" />,
                            title: "设备完美适配",
                            description: "针对主流 iPhone 型号进行像素级适配，完美避开刘海与灵动岛。"
                        },
                        {
                            icon: <Clock className="h-6 w-6" />,
                            title: "实时时间引擎",
                            description: "基于 Cloudflare Worker 边缘计算，无论身处何地，时间始终精准。"
                        },
                        {
                            icon: <Palette className="h-6 w-6" />,
                            title: "极致美学设计",
                            description: "继承苹果极简美学，支持深色模式与自定义配色方案。"
                        }
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="h-full border-none bg-muted/50 transition-colors hover:bg-muted">
                                <CardContent className="pt-8 space-y-4 text-center md:text-left">
                                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold">{feature.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {feature.description}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    )
}
