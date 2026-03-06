/**
 * [INPUT]: 依赖 react JSX 与可选 className
 * [OUTPUT]: 对外提供 CardFieldsStack、CardField 两个布局壳组件
 * [POS]: workspace/cards 的字段布局骨架，统一 200px 列宽与标题/提示排版
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { cn } from "@/lib/utils"

function CardFieldsStack({ children, className = "", gap = "gap-4" }) {
    return (
        <div className={cn("flex w-full max-w-full flex-col items-center px-4 py-1", gap, className)}>
            {children}
        </div>
    )
}

function CardField({ label, hint, children, className = "", labelClassName = "" }) {
    return (
        <div className={cn("w-[200px] max-w-full", className)}>
            {(label || hint) && (
                <div className={cn("mb-1.5 inline-flex items-center gap-1 text-xs text-kumo-subtle", labelClassName)}>
                    {label ? <span>{label}</span> : null}
                    {hint ? <span>{hint}</span> : null}
                </div>
            )}
            {children}
        </div>
    )
}

export { CardField, CardFieldsStack }
