/**
 * [INPUT]: 依赖 @/components/landing/ 全部 Section 组件
 * [OUTPUT]: 完整 Landing Page 页面
 * [POS]: 页面层 - 组合所有 Section 形成完整落地页，管理跨 Section 状态
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { useState } from "react"
import { Hero } from "@/components/landing/Hero"
import { TypesSection } from "@/components/landing/TypesSection"
import { CustomizeSection } from "@/components/landing/CustomizeSection"
import { SetupSection } from "@/components/landing/SetupSection"
import { LandingFooter } from "@/components/landing/LandingFooter"

export default function LandingPage() {
    const [selectedType, setSelectedType] = useState(null)

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1">
                <Hero />
                <TypesSection onSelectType={setSelectedType} />
                <CustomizeSection selectedType={selectedType} />
                <SetupSection />
            </main>
            <LandingFooter />
        </div>
    )
}

