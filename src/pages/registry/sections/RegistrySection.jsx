/**
 * [INPUT]: 依赖 @cloudflare/kumo (Surface, Text)
 * [OUTPUT]: 对外提供 RegistrySection 容器组件
 * [POS]: pages/registry/sections 的通用区块包装器
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { Surface, Text } from "@cloudflare/kumo"

function RegistrySection({ id, title, description, children }) {
    return (
        <section id={id} className="scroll-mt-24 space-y-4">
            <div className="space-y-1">
                <Text variant="heading3">{title}</Text>
                <Text variant="secondary">{description}</Text>
            </div>
            <Surface className="rounded-xl border border-kumo-line bg-kumo-base p-6">
                {children}
            </Surface>
        </section>
    )
}

export { RegistrySection }
