/**
 * [INPUT]: 依赖 framer-motion, lucide-react, @/components/ui/ (Card)
 * [OUTPUT]: Problem-Agitation Section (Apple Spring 动效)
 * [POS]: Landing 痛点层 - Spring stagger 进场
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { motion } from "framer-motion"
import { X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { fadeInUp, staggerContainer, staggerItem, viewportConfig } from "@/lib/motion"

const PAIN_POINTS = [
    {
        title: "时间飞逝无感知",
        description: "日复一日，年复一年，你是否感到时间在指缝中悄然流逝？"
    },
    {
        title: "锁屏毫无意义",
        description: "每天解锁手机上百次，却从未让这一瞬间激发任何思考。"
    },
    {
        title: "定制门槛太高",
        description: "想要一张个性化的进度墙纸，却苦于没有设计技能？"
    }
]

export function ProblemSection() {
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
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight">
                            你是否还在为此困扰？
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            大多数人每天点亮屏幕 200+ 次，却从未思考过如何利用这些瞬间。
                        </p>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    >
                        {PAIN_POINTS.map((point, i) => (
                            <motion.div key={i} variants={staggerItem}>
                                <Card variant="inset" className="h-full">
                                    <CardContent className="pt-8 space-y-4">
                                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10">
                                            <X className="h-6 w-6 text-destructive" />
                                        </div>
                                        <h3 className="text-xl font-bold">{point.title}</h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {point.description}
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
