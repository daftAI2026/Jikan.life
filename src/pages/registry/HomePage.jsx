/**
 * [INPUT]: 依赖 react(useState), react-router-dom, registry/sections (HomeTopbar/Sidebar/ThemeToggle/LanguageSelect/HomeGrid)
 * [OUTPUT]: 对外提供 HomePage 页面组件
 * [POS]: pages/registry 的路由入口，维护 selectedStyle 单一真相源并编排双栏工作区与全局工具入口
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { useState } from "react"
import { useLocation } from "react-router-dom"
import { HomeTopbar } from "./sections/HomeTopbar"
import { HomeSidebar } from "./sections/HomeSidebar"
import { ThemeToggle } from "./sections/ThemeToggle"
import { LanguageSelect } from "./sections/LanguageSelect"
import { HomeGrid } from "./sections/components/HomeGrid"

function HomePage() {
    const location = useLocation()
    const [selectedStyle, setSelectedStyle] = useState("year")

    return (
        <div className="isolate">
            <HomeSidebar
                currentPath={location.pathname}
                selectedStyle={selectedStyle}
                onStyleChange={setSelectedStyle}
            />

            <div className="pointer-events-auto fixed top-0 right-2 z-50 flex h-[49px] items-center">
                <ThemeToggle />
            </div>

            <div className="pointer-events-auto fixed right-2 bottom-2 z-50 md:hidden">
                <LanguageSelect />
            </div>

            <div
                id="main-content"
                className="main-content mt-[49px] h-[calc(100vh-49px)] overflow-hidden transition-[margin] duration-300 md:mt-0 md:h-screen md:ml-12"
            >
                <div className="flex h-full flex-col">
                    <HomeTopbar />
                    <main className="flex min-h-0 grow flex-col md:pr-12">
                        <div className="mx-auto h-full w-full grow overflow-hidden border-r border-kumo-line">
                            <HomeGrid selectedStyle={selectedStyle} />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}

export default HomePage
