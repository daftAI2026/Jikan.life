/**
 * [INPUT]: 依赖 @/components/ui (Tabs, Badge), @/lib/motion, framer-motion, @/lib/I18nContext
 * [OUTPUT]: 对外提供 SetupSection 组件 (iOS/Android 设置教程 + i18n)
 * [POS]: landing/ 的设置教程模块，位于 Customize 之后
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { motion } from "framer-motion"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { staggerContainer, staggerItem, fadeInUp, viewportConfig } from "@/lib/motion"
import { Apple, Smartphone, AlertTriangle } from "lucide-react"
import { useI18n } from "@/lib/I18nContext"

function CodeSnippet({ children }) {
    return (
        <code className="inline-block px-2 py-0.5 rounded bg-muted/80 dark:bg-black/60 text-foreground font-mono text-xs border border-border break-all">
            {children}
        </code>
    )
}

function HighlightBadge({ children }) {
    return (
        <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-2 rounded-md bg-amber-500/20 dark:bg-amber-500/30 text-amber-700 dark:text-amber-300 text-sm font-medium border border-amber-500/30">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            {children}
        </span>
    )
}

function Strong({ children }) {
    return <strong className="font-semibold text-foreground">{children}</strong>
}

function StepTimeline({ steps }) {
    return (
        <motion.div className="flex flex-col gap-0" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportConfig}>
            {steps.map((step, index) => (
                <motion.div key={step.number} variants={staggerItem} className="relative flex gap-4">
                    {index < steps.length - 1 && <div className="absolute left-[19px] top-[40px] w-[2px] h-[calc(100%-24px)] bg-border" aria-hidden="true" />}
                    <div className="relative z-10 flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm shadow-md">{step.number}</div>
                    </div>
                    <div className="flex-1 pb-8">
                        <h3 className="font-semibold text-foreground text-base mb-2">{step.title}</h3>
                        <div className="text-sm text-muted-foreground leading-relaxed">{step.description}</div>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    )
}

export function SetupSection() {
    const { t } = useI18n()

    // 使用 dangerouslySetInnerHTML 渲染带 HTML 的翻译，需要包装组件
    const HtmlDesc = ({ htmlKey }) => (
        <span dangerouslySetInnerHTML={{ __html: t(htmlKey) }} />
    )

    const IOS_STEPS = [
        { number: 1, title: t('setup.ios.step1'), description: <HtmlDesc htmlKey="setup.ios.step1Desc" /> },
        { number: 2, title: t('setup.ios.step2'), description: <HtmlDesc htmlKey="setup.ios.step2Desc" /> },
        { number: 3, title: t('setup.ios.step3'), description: <HtmlDesc htmlKey="setup.ios.step3Desc" /> },
        { number: 4, title: t('setup.ios.step4'), description: <HtmlDesc htmlKey="setup.ios.step4Desc" /> }
    ]

    const ANDROID_STEPS = [
        { number: 1, title: t('setup.android.step1'), description: <HtmlDesc htmlKey="setup.android.step1Desc" /> },
        { number: 2, title: t('setup.android.step2'), description: <HtmlDesc htmlKey="setup.android.step2Desc" /> },
        { number: 3, title: t('setup.android.step3'), description: <HtmlDesc htmlKey="setup.android.step3Desc" /> },
        { number: 4, title: t('setup.android.step4'), description: <HtmlDesc htmlKey="setup.android.step4Desc" /> },
        { number: 5, title: t('setup.android.step5'), description: <HtmlDesc htmlKey="setup.android.step5Desc" /> }
    ]

    return (
        <section id="setup" className="py-24 px-6 bg-background">
            <div className="max-w-4xl mx-auto">
                <motion.div className="text-center mb-12" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={viewportConfig}>
                    <Badge variant="secondary" className="mb-4">{t('setup.header')}</Badge>
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">{t('setup.title')}</h2>
                </motion.div>

                <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={viewportConfig}>
                    <Tabs defaultValue="ios" className="w-full">
                        <TabsList className="grid w-full max-w-xs mx-auto grid-cols-2 mb-8">
                            <TabsTrigger value="ios" className="gap-2"><Apple className="w-4 h-4" />{t('setup.ios')}</TabsTrigger>
                            <TabsTrigger value="android" className="gap-2"><Smartphone className="w-4 h-4" />{t('setup.android')}</TabsTrigger>
                        </TabsList>
                        <TabsContent value="ios" className="mt-0">
                            <div className="bg-card rounded-[20px] p-6 md:p-8 border shadow-sm"><StepTimeline steps={IOS_STEPS} /></div>
                        </TabsContent>
                        <TabsContent value="android" className="mt-0">
                            <div className="bg-card rounded-[20px] p-6 md:p-8 border shadow-sm"><StepTimeline steps={ANDROID_STEPS} /></div>
                        </TabsContent>
                    </Tabs>
                </motion.div>
            </div>
        </section>
    )
}

export default SetupSection
