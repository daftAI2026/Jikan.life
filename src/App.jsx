/**
 * [INPUT]: 依赖 react-router-dom, framer-motion, react-aria-components (I18nProvider), @cloudflare/kumo(Toasty), HomePage 与 OpeningIntroOverlay
 * [OUTPUT]: 对外提供 App 根组件 (Apple 级页面过渡 + 国际化 + 首页开场挂载)
 * [POS]: 项目根组件，负责路由配置、骨架布局、国际化同步与首页品牌开场接入
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom"
import { AnimatePresence, MotionConfig, motion } from "framer-motion"
import { Toasty } from "@cloudflare/kumo"
import { I18nProvider, useI18n } from "@/lib/I18nContext"
import { I18nProvider as AriaI18nProvider } from "react-aria-components"
import { OpeningIntroOverlay } from "@/components/OpeningIntroOverlay"
import HomePage from "@/pages/registry/HomePage"
import { pageTransition } from "@/lib/motion"

/* ========================================
   Aria I18n Wrapper - 同步语言到 react-aria
   ======================================== */
function AriaI18nWrapper({ children }) {
    const { lang } = useI18n()

    // 将我们的语言代码映射到 react-aria 的 locale
    const ariaLocale =
        lang === "zh-CN" ? "zh-CN" : lang === "zh-TW" ? "zh-TW" : lang === "ja" ? "ja-JP" : "en-US"

    return (
        <AriaI18nProvider locale={ariaLocale}>
            {children}
        </AriaI18nProvider>
    )
}

/* ========================================
   首页路由壳层
   ======================================== */
function HomeRouteShell() {
    return (
        <>
            <OpeningIntroOverlay />
            <HomePage />
        </>
    )
}

/* ========================================
   路由动画包装器
   ======================================== */
function AnimatedRoutes() {
    const location = useLocation()

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageTransition}
                className="flex-1"
            >
                <Routes location={location}>
                    <Route path="/" element={<HomeRouteShell />} />
                    <Route path="/app" element={<Navigate to="/" replace />} />
                </Routes>
            </motion.div>
        </AnimatePresence>
    )
}

/* ========================================
   App 根组件
   ======================================== */
function App() {
    return (
        <I18nProvider>
            <AriaI18nWrapper>
                <MotionConfig reducedMotion="user">
                    <Toasty>
                        <BrowserRouter>
                            <div className="relative flex min-h-screen flex-col bg-kumo-base">
                                <AnimatedRoutes />
                            </div>
                        </BrowserRouter>
                    </Toasty>
                </MotionConfig>
            </AriaI18nWrapper>
        </I18nProvider>
    )
}

export default App
