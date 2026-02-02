/**
 * [INPUT]: 依赖 @/components/ui (Tabs, Badge), @/lib/motion, framer-motion
 * [OUTPUT]: 对外提供 SetupSection 组件 (iOS/Android 设置教程)
 * [POS]: landing/ 的设置教程模块，位于 Customize 之后
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { motion } from "framer-motion"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
    staggerContainer,
    staggerItem,
    fadeInUp,
    viewportConfig
} from "@/lib/motion"
import { Apple, Smartphone, AlertTriangle } from "lucide-react"

/* ========================================
   视觉强调组件
   ======================================== */

/** 代码片段 - 深色背景 + 等宽字体 */
function CodeSnippet({ children }) {
    return (
        <code className="inline-block px-2 py-0.5 rounded bg-muted/80 dark:bg-black/60 text-foreground font-mono text-xs border border-border break-all">
            {children}
        </code>
    )
}

/** 高亮警告徽章 - 黄色底色 */
function HighlightBadge({ children }) {
    return (
        <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-2 rounded-md bg-amber-500/20 dark:bg-amber-500/30 text-amber-700 dark:text-amber-300 text-sm font-medium border border-amber-500/30">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            {children}
        </span>
    )
}

/** 关键词强调 */
function Strong({ children }) {
    return <strong className="font-semibold text-foreground">{children}</strong>
}

/* ========================================
   步骤数据定义 (使用 JSX 描述)
   ======================================== */

const IOS_STEPS = [
    {
        number: 1,
        title: 'Copy URL',
        description: (
            <span>Configure your wallpaper above and copy the generated URL</span>
        )
    },
    {
        number: 2,
        title: 'Create Automation',
        description: (
            <span>
                Shortcuts App → Automation Tab → New Automation<br />
                Time of Day: <Strong>6:00 AM</Strong> → Repeat <Strong>Daily</Strong><br />
                Select <Strong>Run Immediately</Strong> → Create New Shortcut
            </span>
        )
    },
    {
        number: 3,
        title: 'Configure Shortcut',
        description: (
            <span>
                <Strong>1. Get Contents of URL:</Strong><br />
                <CodeSnippet>https://lifegrid.xxx.workers.dev/generate?...</CodeSnippet><br /><br />
                <Strong>2. Set Wallpaper Photo:</Strong><br />
                Choose "Lock Screen" as the target.
            </span>
        )
    },
    {
        number: 4,
        title: 'Finalize',
        description: (
            <span>
                In "Set Wallpaper Photo", tap arrow (→):<br />
                <HighlightBadge>
                    Disable <Strong>Crop to Subject</Strong> and <Strong>Show Preview</Strong>
                </HighlightBadge>
            </span>
        )
    }
]

const ANDROID_STEPS = [
    {
        number: 1,
        title: 'Copy URL',
        description: (
            <span>Configure your wallpaper above and copy the generated URL</span>
        )
    },
    {
        number: 2,
        title: 'Prerequisites',
        description: (
            <span>
                Install <Strong>MacroDroid</Strong> from Google Play Store.
            </span>
        )
    },
    {
        number: 3,
        title: 'Setup Macro',
        description: (
            <span>
                Trigger: Date/Time → Day/Time <CodeSnippet>00:01:00</CodeSnippet> → Active all weekdays
            </span>
        )
    },
    {
        number: 4,
        title: 'Configure Actions',
        description: (
            <span>
                <Strong>4.1 Download Image</Strong><br />
                Web Interactions → HTTP Request (GET)<br />
                Paste URL. Enable "Block next actions"<br />
                Tick "Save response" → <CodeSnippet>/Download/lifegrid.png</CodeSnippet><br /><br />
                <Strong>4.2 Set Wallpaper</Strong><br />
                Device Settings → Set Wallpaper<br />
                Select <CodeSnippet>/Download/lifegrid.png</CodeSnippet><br />
                <HighlightBadge>Use exact same filename</HighlightBadge>
            </span>
        )
    },
    {
        number: 5,
        title: 'Finalize',
        description: (
            <span>
                Give macro a name → Tap <Strong>Create Macro</Strong>
            </span>
        )
    }
]

/* ========================================
   StepTimeline 子组件
   ======================================== */

function StepTimeline({ steps }) {
    return (
        <motion.div
            className="flex flex-col gap-0"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
        >
            {steps.map((step, index) => (
                <motion.div
                    key={step.number}
                    variants={staggerItem}
                    className="relative flex gap-4"
                >
                    {/* 垂直连接线 */}
                    {index < steps.length - 1 && (
                        <div
                            className="absolute left-[19px] top-[40px] w-[2px] h-[calc(100%-24px)] bg-border"
                            aria-hidden="true"
                        />
                    )}

                    {/* 步骤编号 */}
                    <div className="relative z-10 flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm shadow-md">
                            {step.number}
                        </div>
                    </div>

                    {/* 步骤内容 */}
                    <div className="flex-1 pb-8">
                        <h3 className="font-semibold text-foreground text-base mb-2">
                            {step.title}
                        </h3>
                        <div className="text-sm text-muted-foreground leading-relaxed">
                            {step.description}
                        </div>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    )
}

/* ========================================
   SetupSection 主组件
   ======================================== */

export function SetupSection() {
    return (
        <section
            id="setup"
            className="py-24 px-6 bg-background"
        >
            <div className="max-w-4xl mx-auto">
                {/* Section Header */}
                <motion.div
                    className="text-center mb-12"
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportConfig}
                >
                    <Badge variant="secondary" className="mb-4">
                        Almost There
                    </Badge>
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                        Set it and forget it
                    </h2>
                </motion.div>

                {/* Tabs Container */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportConfig}
                >
                    <Tabs defaultValue="ios" className="w-full">
                        {/* Platform Tabs */}
                        <TabsList className="grid w-full max-w-xs mx-auto grid-cols-2 mb-8">
                            <TabsTrigger value="ios" className="gap-2">
                                <Apple className="w-4 h-4" />
                                iOS
                            </TabsTrigger>
                            <TabsTrigger value="android" className="gap-2">
                                <Smartphone className="w-4 h-4" />
                                Android
                            </TabsTrigger>
                        </TabsList>

                        {/* iOS Content */}
                        <TabsContent value="ios" className="mt-0">
                            <div className="bg-card rounded-[20px] p-6 md:p-8 border shadow-sm">
                                <StepTimeline steps={IOS_STEPS} />
                            </div>
                        </TabsContent>

                        {/* Android Content */}
                        <TabsContent value="android" className="mt-0">
                            <div className="bg-card rounded-[20px] p-6 md:p-8 border shadow-sm">
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
