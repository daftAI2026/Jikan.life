/**
 * [INPUT]: 依赖 framer-motion, lucide-react, @/components/ui/
 * [OUTPUT]: Pricing Section (Apple Spring 动效)
 * [POS]: Landing 定价层 - Spring stagger + highlighted 弹入
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { motion } from "framer-motion"
import { Check, X } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { fadeInUp, staggerContainer, staggerItem, viewportConfig, scaleIn, bouncy } from "@/lib/motion"

const PLANS = [
    {
        name: "Free",
        price: "¥0",
        period: "永久免费",
        description: "适合个人用户，满足基础需求",
        features: [
            { text: "年度进度墙纸", included: true },
            { text: "基础配色方案", included: true },
            { text: "5 种设备模板", included: true },
            { text: "人生网格墙纸", included: false },
            { text: "目标倒计时", included: false },
            { text: "自定义品牌水印", included: false },
        ],
        cta: "开始使用",
        highlighted: false
    },
    {
        name: "Pro",
        price: "¥0",
        period: "开源免费",
        description: "完整功能，无任何限制",
        features: [
            { text: "年度进度墙纸", included: true },
            { text: "无限配色方案", included: true },
            { text: "全部设备模板", included: true },
            { text: "人生网格墙纸", included: true },
            { text: "目标倒计时", included: true },
            { text: "移除水印", included: true },
        ],
        cta: "立即体验",
        highlighted: true
    },
    {
        name: "Enterprise",
        price: "定制",
        period: "联系我们",
        description: "企业级定制，专属服务",
        features: [
            { text: "全部 Pro 功能", included: true },
            { text: "私有化部署", included: true },
            { text: "API 接口", included: true },
            { text: "品牌定制", included: true },
            { text: "专属客服", included: true },
            { text: "SLA 保障", included: true },
        ],
        cta: "联系销售",
        highlighted: false
    }
]

export function Pricing() {
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
                            <Badge variant="secondary">定价方案</Badge>
                        </motion.div>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight">
                            简单透明的定价
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            开源免费，无隐藏费用。企业用户可联系我们获取定制方案。
                        </p>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start"
                    >
                        {PLANS.map((plan, i) => (
                            <motion.div
                                key={i}
                                variants={plan.highlighted ? scaleIn : staggerItem}
                                className={plan.highlighted ? "md:-mt-4 md:mb-4" : ""}
                            >
                                <Card
                                    variant={plan.highlighted ? "elevated" : "flat"}
                                    className={`h-full ${plan.highlighted ? "ring-2 ring-primary" : ""}`}
                                >
                                    <CardHeader className="text-center pb-8 pt-6">
                                        {plan.highlighted && (
                                            <motion.div
                                                variants={bouncy}
                                                className="self-center mb-4"
                                            >
                                                <Badge variant="gradient">推荐</Badge>
                                            </motion.div>
                                        )}
                                        <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                        <div className="mt-4">
                                            <span className="text-4xl font-black">{plan.price}</span>
                                            <span className="text-muted-foreground ml-2">/ {plan.period}</span>
                                        </div>
                                        <CardDescription className="mt-2">{plan.description}</CardDescription>
                                    </CardHeader>

                                    <CardContent className="space-y-4">
                                        {plan.features.map((feature, j) => (
                                            <motion.div
                                                key={j}
                                                className="flex items-center gap-3"
                                                initial={{ opacity: 0, x: -10 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 350,
                                                    damping: 30,
                                                    delay: j * 0.03
                                                }}
                                            >
                                                {feature.included ? (
                                                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                                                ) : (
                                                    <X className="h-5 w-5 text-muted-foreground/50 flex-shrink-0" />
                                                )}
                                                <span className={feature.included ? "" : "text-muted-foreground/50"}>
                                                    {feature.text}
                                                </span>
                                            </motion.div>
                                        ))}
                                    </CardContent>

                                    <CardFooter className="pt-6">
                                        <Button
                                            className="w-full"
                                            variant={plan.highlighted ? "default" : "outline"}
                                            size="lg"
                                        >
                                            {plan.cta}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
