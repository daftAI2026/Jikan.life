/**
 * [INPUT]: 依赖 framer-motion, lucide-react, @/components/ui/ (Card, Badge)
 * [OUTPUT]: Features Section (Apple Spring + Bento Grid)
 * [POS]: Landing 功能层 - Spring stagger 进场 + hover lift
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { motion } from "framer-motion"
import { Smartphone, Clock, Palette, Globe, Zap, Shield } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fadeInUp, staggerContainer, staggerItem, viewportConfig, scaleIn } from "@/lib/motion"

const FEATURES = [
    {
        icon: Smartphone,
        title: "设备完美适配",
        description: "针对主流 iPhone 型号进行像素级适配，完美避开刘海与灵动岛。",
        span: "col-span-1 md:col-span-2",
        featured: true
    },
    {
        icon: Clock,
        title: "实时时间引擎",
        description: "基于边缘计算，无论身处何地，时间始终精准。",
        span: "col-span-1"
    },
    {
        icon: Palette,
        title: "极致美学设计",
        description: "继承极简美学，支持深色模式与自定义配色。",
        span: "col-span-1"
    },
    {
        icon: Globe,
        title: "多语言支持",
        description: "支持中英日多语言，根据地区自动切换。",
        span: "col-span-1"
    },
    {
        icon: Zap,
        title: "极速生成",
        description: "毫秒级响应，SVG 矢量渲染确保清晰。",
        span: "col-span-1"
    },
    {
        icon: Shield,
        title: "隐私优先",
        description: "无需登录，数据不上传，URL 即状态。",
        span: "col-span-1"
    }
]

export function FeaturesSection() {
    return (
        <section className="py-20 md:py-28 lg:py-32">
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
                            <Badge variant="secondary">功能特性</Badge>
                        </motion.div>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight">
                            你需要的一切，这里都有
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            从设计到生成，从本地化到隐私保护，每一个细节都经过深思熟虑。
                        </p>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    >
                        {FEATURES.map((feature, i) => (
                            <motion.div
                                key={i}
                                variants={staggerItem}
                                className={feature.span}
                            >
                                <Card
                                    variant={feature.featured ? "elevated" : "flat"}
                                    className="h-full"
                                >
                                    <CardContent className="pt-8 space-y-4">
                                        <motion.div
                                            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl"
                                            style={{
                                                background: 'linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 70%, black) 100%)'
                                            }}
                                            whileHover={{ rotate: 5, scale: 1.1 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                        >
                                            <feature.icon className="h-6 w-6 text-primary-foreground" />
                                        </motion.div>
                                        <h3 className="text-xl font-bold">{feature.title}</h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
