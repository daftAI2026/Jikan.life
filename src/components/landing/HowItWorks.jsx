/**
 * [INPUT]: 依赖 framer-motion, @/components/ui/ (Card, Badge)
 * [OUTPUT]: How It Works Section (Apple Spring 动效)
 * [POS]: Landing 流程层 - 顺序 Spring reveal
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fadeInUp, staggerContainer, staggerItem, viewportConfig, scaleIn, bouncy } from "@/lib/motion"

const STEPS = [
    {
        step: 1,
        title: "选择墙纸类型",
        description: "年度进度、人生网格或目标倒计时，选择最适合你的可视化方式。",
        visual: "📊"
    },
    {
        step: 2,
        title: "自定义配置",
        description: "设置生日、目标日期、配色方案、设备型号等个性化参数。",
        visual: "🎨"
    },
    {
        step: 3,
        title: "一键生成下载",
        description: "点击生成，获取完美适配你设备的高清 PNG 墙纸。",
        visual: "📱"
    }
]

export function HowItWorks() {
    return (
        <section className="py-20 md:py-28 bg-muted/30">
            <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportConfig}
                    className="space-y-12"
                >
                    <motion.div variants={fadeInUp} className="text-center space-y-4">
                        <motion.div variants={scaleIn}>
                            <Badge variant="secondary">使用流程</Badge>
                        </motion.div>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight">
                            三步完成定制
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            无需设计技能，无需下载 App，60 秒内获得你的专属墙纸。
                        </p>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        className="relative"
                    >
                        {/* Connector Line - Hidden on mobile */}
                        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border hidden md:block" />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                            {STEPS.map((step, i) => (
                                <motion.div
                                    key={i}
                                    variants={staggerItem}
                                    className="relative"
                                >
                                    <Card variant="elevated" className="h-full">
                                        <CardContent className="pt-8 text-center space-y-4">
                                            {/* Step Number */}
                                            <motion.div
                                                className="mx-auto w-12 h-12 rounded-full flex items-center justify-center text-lg font-black text-primary-foreground"
                                                style={{
                                                    background: 'linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 70%, black) 100%)',
                                                    boxShadow: '0 4px 12px color-mix(in srgb, var(--primary) 35%, transparent)'
                                                }}
                                                whileHover={{ scale: 1.1, rotate: 10 }}
                                                transition={bouncy}
                                            >
                                                {step.step}
                                            </motion.div>

                                            {/* Visual */}
                                            <motion.div
                                                className="text-5xl"
                                                whileHover={{ scale: 1.2, y: -5 }}
                                                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                            >
                                                {step.visual}
                                            </motion.div>

                                            {/* Content */}
                                            <h3 className="text-xl font-bold">{step.title}</h3>
                                            <p className="text-muted-foreground leading-relaxed">
                                                {step.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
