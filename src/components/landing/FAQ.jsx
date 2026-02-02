/**
 * [INPUT]: 依赖 framer-motion, @/components/ui/ (Accordion, Badge)
 * [OUTPUT]: FAQ Section 组件
 * [POS]: Landing 答疑层 - 解答常见问题，消除购买顾虑
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { motion } from "framer-motion"
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { fadeInUp, staggerContainer, viewportConfig } from "@/lib/motion"

const FAQS = [
    {
        question: "JIKAN 是免费的吗？",
        answer: "是的，JIKAN 是一个开源项目，所有核心功能完全免费。我们相信优秀的工具应该让每个人都能使用。"
    },
    {
        question: "支持哪些设备？",
        answer: "目前我们完美支持 iPhone 13 到 iPhone 16 系列的所有机型，包括普通版、Pro、Pro Max 和 Plus。我们会持续更新以支持更多设备。"
    },
    {
        question: "生成的墙纸有水印吗？",
        answer: "没有水印。我们生成的墙纸完全干净，你可以自由使用。如果你喜欢我们的项目，欢迎在 GitHub 上 Star！"
    },
    {
        question: "需要登录才能使用吗？",
        answer: "不需要。JIKAN 采用 URL 即状态的设计理念，所有配置都编码在 URL 中。你可以直接使用，无需注册或登录。"
    },
    {
        question: "我的数据安全吗？",
        answer: "绝对安全。我们不收集任何个人数据，生日和目标日期等信息仅存储在你的浏览器 URL 中，不会上传到任何服务器。"
    },
    {
        question: "如何自动更新墙纸？",
        answer: "目前需要手动重新生成并设置墙纸。我们正在开发 iOS 快捷指令，未来可以实现自动化更新。"
    }
]

export function FAQ() {
    return (
        <section className="py-20 md:py-28 lg:py-32">
            <div className="container max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportConfig}
                    className="space-y-12"
                >
                    <motion.div variants={fadeInUp} className="text-center space-y-4">
                        <Badge variant="secondary">常见问题</Badge>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight">
                            有疑问？这里有答案
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            最常被问到的问题，如果没找到答案，欢迎在 GitHub 上提 Issue。
                        </p>
                    </motion.div>

                    <motion.div variants={fadeInUp}>
                        <Accordion type="single" collapsible className="w-full">
                            {FAQS.map((faq, i) => (
                                <AccordionItem key={i} value={`item-${i}`}>
                                    <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                                        {faq.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground leading-relaxed">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
