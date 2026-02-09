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
        <code className="inline-block px-2 py-0.5 rounded bg-muted/80 text-foreground font-mono text-xs border border-border break-all">
            {children}
        </code>
    )
}

function HighlightBadge({ children }) {
    return (
        <span className="highlight-badge flex items-start gap-2 text-left">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{children}</span>
        </span>
    )
}

/**
 * [INPUT]: 步骤编号, 标题, 翻译 Key
 * [OUTPUT]: Android 专用的子步骤卡片
 * [POS]: StepTimeline 内部的增强卡片
 */
function SubStepCard({ number, title, htmlKey }) {
    const { t } = useI18n()
    return (
        <div className="p-5 rounded-2xl border bg-card/50 shadow-sm backdrop-blur-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
                <div className="h-7 px-2 flex items-center justify-center rounded-lg bg-primary text-primary-foreground font-mono text-xs font-bold shadow-sm">
                    {number}
                </div>
                <h4 className="font-bold text-foreground text-sm tracking-tight">{title}</h4>
            </div>
            <div className="text-sm text-muted-foreground leading-relaxed">
                <span dangerouslySetInnerHTML={{ __html: t(htmlKey) }} />
            </div>
        </div>
    )
}

function StepTimeline({ steps }) {
    return (
        <motion.div className="flex flex-col gap-0" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportConfig}>
            {steps.map((step, index) => (
                <motion.div key={step.number} variants={staggerItem} className="relative flex gap-4">
                    {index < steps.length - 1 && <div className="absolute left-[19px] top-[40px] w-[2px] h-[calc(100%-24px)] bg-border" aria-hidden="true" />}
                    <div className="relative z-10 shrink-0">
                        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm shadow-md">{step.number}</div>
                    </div>
                    <div className="flex-1 pb-10">
                        <h3 className="font-bold text-foreground text-lg mb-2">{step.title}</h3>
                        <div className="text-sm text-muted-foreground leading-relaxed">{step.description}</div>
                        {step.subcontent && (
                            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {step.subcontent}
                            </div>
                        )}
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
        {
            number: 4,
            title: t('setup.ios.step4'),
            description: (
                <HighlightBadge>
                    <HtmlDesc htmlKey="setup.ios.step4Warning" />
                </HighlightBadge>
            )
        }
    ]

    const ANDROID_STEPS = [
        { number: 1, title: t('setup.android.step1'), description: <HtmlDesc htmlKey="setup.android.step1Desc" /> },
        { number: 2, title: t('setup.android.step2'), description: <HtmlDesc htmlKey="setup.android.step2Desc" /> },
        { number: 3, title: t('setup.android.step3'), description: <HtmlDesc htmlKey="setup.android.step3Desc" /> },
        {
            number: 4,
            title: t('setup.android.step4'),
            description: null,
            subcontent: (
                <>
                    <SubStepCard number="4.1" title={t('setup.android.step4_1')} htmlKey="setup.android.step4_1Desc" />
                    <SubStepCard number="4.2" title={t('setup.android.step4_2')} htmlKey="setup.android.step4_2Desc" />
                </>
            )
        },
        { number: 5, title: t('setup.android.step5'), description: <HtmlDesc htmlKey="setup.android.step5Desc" /> }
    ]

    return (
        <section id="setup" className="py-24 px-6 bg-background">
            <div className="max-w-5xl mx-auto">
                <motion.div className="text-center mb-16" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={viewportConfig}>
                    <Badge variant="secondary" className="mb-4 px-4 py-1">{t('setup.header')}</Badge>
                    <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">{t('setup.title')}</h2>
                </motion.div>

                <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={viewportConfig}>
                    <Tabs defaultValue="ios" className="w-full">
                        <TabsList className="grid w-full max-w-xs mx-auto grid-cols-2 mb-12 p-1 bg-muted/50 rounded-full">
                            <TabsTrigger value="ios" className="gap-2 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                                <Apple className="w-4 h-4" />{t('setup.ios')}
                            </TabsTrigger>
                            <TabsTrigger value="android" className="gap-2 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                                <Smartphone className="w-4 h-4" />{t('setup.android')}
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="ios" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                            <div className="bg-card/30 rounded-[32px] p-8 md:p-12 border shadow-xl backdrop-blur-md">
                                <StepTimeline steps={IOS_STEPS} />
                            </div>
                        </TabsContent>
                        <TabsContent value="android" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                            <div className="bg-card/30 rounded-[32px] p-8 md:p-12 border shadow-xl backdrop-blur-md">
                                <StepTimeline steps={ANDROID_STEPS} />
                            </div>
                        </TabsContent>
                    </Tabs>
                </motion.div>
            </div>
        </section>
    )
}

export default SetupSection
