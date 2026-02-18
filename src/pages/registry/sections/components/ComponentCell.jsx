/**
 * [INPUT]: 依赖 @/components/ui/kumo (Text), @/lib/utils
 * [OUTPUT]: 对外提供 ComponentCell 组件
 * [POS]: registry/sections/components 的网格单元
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { Text } from "@/components/ui/kumo"
import { cn } from "@/lib/utils"

function ComponentCell({ title, children, className }) {
    return (
        <section
            className={cn(
                "flex min-h-[190px] flex-col gap-4 bg-kumo-base p-6",
                className
            )}
            data-component-cell
        >
            <Text variant="secondary" className="text-sm text-kumo-subtle">
                {title}
            </Text>
            <div className="flex flex-1 items-start">
                {children}
            </div>
        </section>
    )
}

export { ComponentCell }
