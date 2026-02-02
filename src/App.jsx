/**
 * [INPUT]: 依赖 react-router-dom, framer-motion (AnimatePresence, MotionConfig), @/components/
 * [OUTPUT]: 对外提供 App 根组件 (Apple 级页面过渡)
 * [POS]: 项目根组件，负责路由配置与骨架布局，集成 reduced motion 支持
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence, MotionConfig, motion } from "framer-motion"
import { Header } from "@/components/layout/Header"
import LandingPage from "@/pages/LandingPage"
import DesignSystem from "@/pages/DesignSystem"
import { Toaster } from "@/components/ui/sonner"
import { pageTransition } from "@/lib/motion"

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
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/design" element={<DesignSystem />} />
                </Routes>
            </motion.div>
        </AnimatePresence>
    )
}

import { I18nProvider } from "@/lib/I18nContext"

/* ========================================
   App 根组件
   ======================================== */
function App() {
    return (
        <I18nProvider>
            <MotionConfig reducedMotion="user">
                <BrowserRouter>
                    <div className="relative flex min-h-screen flex-col bg-background">
                        <Header />
                        <main className="flex-1 flex flex-col">
                            <AnimatedRoutes />
                        </main>
                        <Toaster />
                    </div>
                </BrowserRouter>
            </MotionConfig>
        </I18nProvider>
    )
}

export default App
