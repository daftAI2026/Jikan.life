/**
 * [INPUT]: 依赖 react-router-dom, registry/sections (RegistryTopbar/Sidebar/ThemeToggle/HomeGrid)
 * [OUTPUT]: 对外提供 RegistryHome 页面组件
 * [POS]: pages/registry 的路由入口，复刻 Kumo 首页布局
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { useLocation } from "react-router-dom"
import { RegistryTopbar } from "./sections/RegistryTopbar"
import { RegistrySidebar } from "./sections/RegistrySidebar"
import { ThemeToggle } from "./sections/ThemeToggle"
import { HomeGrid } from "./sections/components/HomeGrid"

function RegistryHome() {
    const location = useLocation()

    return (
        <div className="isolate">
            <RegistrySidebar currentPath={location.pathname} />

            <div className="pointer-events-auto fixed top-0 right-2 z-50 flex h-[49px] items-center">
                <ThemeToggle />
            </div>

            <div
                id="main-content"
                className="main-content mt-[49px] h-screen overflow-y-auto overscroll-y-none transition-[margin] duration-300 md:mt-0 md:ml-12"
            >
                <div className="flex flex-col">
                    <RegistryTopbar />
                    <main className="flex grow flex-col md:pr-12">
                        <div className="mx-auto w-full grow border-r border-kumo-line">
                            <HomeGrid />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}

export default RegistryHome
