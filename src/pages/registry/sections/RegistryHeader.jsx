/**
 * [INPUT]: 依赖 @/components/ui/kumo (Button, Input, Text), @phosphor-icons/react
 * [OUTPUT]: 对外提供 RegistryHeader 顶部导航
 * [POS]: pages/registry/sections 的顶栏区域
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { Button, Input, Text } from "@/components/ui/kumo"
import { Plus } from "@phosphor-icons/react"
import { TOP_NAV } from "../registry-data"

function RegistryHeader() {
    return (
        <header className="sticky top-0 z-50 border-b border-kumo-line bg-kumo-base/90 backdrop-blur">
            <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-kumo-contrast text-kumo-inverse">
                        K
                    </div>
                    <div className="leading-tight">
                        <Text variant="heading3">Kumo UI</Text>
                        <Text variant="secondary">Cloudflare design system</Text>
                    </div>
                </div>

                <nav className="hidden items-center gap-6 text-sm lg:flex">
                    {TOP_NAV.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className="text-kumo-subtle transition hover:text-kumo-default"
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>

                <div className="flex items-center gap-3">
                    <div className="hidden md:block">
                        <Input placeholder="Search components" aria-label="Search components" />
                    </div>
                    <Button variant="secondary" shape="square" icon={Plus} />
                </div>
            </div>
        </header>
    )
}

export { RegistryHeader }
