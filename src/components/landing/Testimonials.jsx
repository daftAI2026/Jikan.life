/**
 * [INPUT]: 依赖 framer-motion, @phosphor-icons/react, @/components/ui/
 * [OUTPUT]: Testimonials Section (Apple Spring 动效)
 * [POS]: Landing 社证层 - Spring stagger 进场
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { motion } from "framer-motion"
import { Quotes, Star } from "@phosphor-icons/react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { fadeInUp, staggerContainer, staggerItem, viewportConfig, scaleIn } from "@/lib/motion"

const TESTIMONIALS = [
    {
        quote: "每天解锁手机时看到人生进度，让我更加珍惜时间。这是我用过最有意义的墙纸生成器。",
        author: "李明",
        role: "产品经理",
        company: "字节跳动",
        avatar: "LM"
    },
    {
        quote: "作为设计师，我对细节要求极高。JIKAN 的像素级适配让我印象深刻，完美避开了灵动岛。",
        author: "张薇",
        role: "UI 设计师",
        company: "阿里巴巴",
        avatar: "ZW"
    },
    {
        quote: "用了三个月了，每次看到年度进度条都会提醒自己：时间不等人，要专注在真正重要的事上。",
        author: "王强",
        role: "独立开发者",
        company: "自由职业",
        avatar: "WQ"
    }
]

function StarRating() {
    return (
        <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 25,
                        delay: i * 0.05
                    }}
                >
                    <Star className="h-4 w-4 fill-primary text-primary" />
                </motion.div>
            ))}
        </div>
    )
}

export function Testimonials() {
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
                            <Badge variant="secondary">用户评价</Badge>
                        </motion.div>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight">
                            他们都在用 JIKAN
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            来自真实用户的反馈，看看他们如何通过墙纸改变对时间的感知。
                        </p>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    >
                        {TESTIMONIALS.map((testimonial, i) => (
                            <motion.div key={i} variants={staggerItem}>
                                <Card variant="elevated" className="h-full">
                                    <CardContent className="pt-8 space-y-6">
                                        {/* Quote Mark */}
                                        <motion.div
                                            className="text-primary/20"
                                            whileHover={{ scale: 1.2, rotate: -5 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                        >
                                            <Quotes className="h-8 w-8" />
                                        </motion.div>

                                        {/* Star Rating */}
                                        <StarRating />

                                        {/* Quote */}
                                        <p className="text-foreground leading-relaxed italic">
                                            "{testimonial.quote}"
                                        </p>

                                        {/* Author */}
                                        <div className="flex items-center gap-3 pt-4 border-t">
                                            <motion.div
                                                whileHover={{ scale: 1.1 }}
                                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                            >
                                                <Avatar className="h-10 w-10">
                                                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                                        {testimonial.avatar}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </motion.div>
                                            <div>
                                                <p className="font-semibold text-sm">{testimonial.author}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {testimonial.role} @ {testimonial.company}
                                                </p>
                                            </div>
                                        </div>
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
