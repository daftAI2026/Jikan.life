/**
 * [INPUT]: 依赖 react JSX、Tooltip 原语、Info 图标与可选 className
 * [OUTPUT]: 对外提供 CardFieldsStack、CardField 两个布局壳组件；CardField 支持可选字段级 tooltip
 * [POS]: workspace/cards 的字段布局骨架，统一 200px 列宽与标题/提示排版，并承接字段级帮助提示
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { Info } from "@phosphor-icons/react"
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

function CardFieldsStack({ children, className = "", gap = "gap-4" }) {
    return (
        <div className={cn("flex w-full max-w-full flex-col items-center px-4 py-1", gap, className)}>
            {children}
        </div>
    )
}

function CardField({ label, hint, tooltip, children, className = "", labelClassName = "" }) {
    const tooltipAriaLabel = typeof label === "string" ? `${label} help` : "Field help"

    return (
        <div className={cn("w-[200px] max-w-full", className)}>
            {(label || hint || tooltip) && (
                <div className={cn("mb-1.5 inline-flex items-center gap-1 text-xs text-kumo-subtle", labelClassName)}>
                    {label ? <span>{label}</span> : null}
                    {tooltip && (
                        <TooltipProvider>
                            <Tooltip content={tooltip} asChild>
                                <button
                                    type="button"
                                    aria-label={tooltipAriaLabel}
                                    className="inline-flex cursor-help text-kumo-subtle transition-colors hover:text-kumo-default"
                                >
                                    <Info size={12} weight="bold" />
                                </button>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                    {hint ? <span>{hint}</span> : null}
                </div>
            )}
            {children}
        </div>
    )
}

export { CardField, CardFieldsStack }
