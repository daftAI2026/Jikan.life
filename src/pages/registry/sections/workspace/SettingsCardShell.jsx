/**
 * [INPUT]: 依赖父层传入 cardId/title/titleTooltip/indexMark/children/className/compactAtDesktop、Tooltip 原语、cn() 与 Kumo token 样式
 * [OUTPUT]: 对外提供 SettingsCardShell 组件（可选左上标题 + 可选问号提示 + 右上序号 + 居中内容 + 壳层布局扩展）
 * [POS]: registry/sections/workspace 的右侧六卡视觉壳层，复刻 Kumo HomeGrid 单卡骨架
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { Info } from "@phosphor-icons/react"
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

function SettingsCardShell({
    cardId,
    title,
    titleTooltip,
    indexMark,
    isIndexActive = true,
    children,
    className,
    compactAtDesktop = true,
}) {
    return (
        <article
            data-home-settings-card={cardId}
            className={cn(
                "relative flex min-h-[220px] items-center justify-center bg-kumo-elevated",
                compactAtDesktop ? "lg:min-h-0" : "",
                className
            )}
        >
            {title && (
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 text-base font-medium text-kumo-subtle">
                    <h3>{title}</h3>
                    {titleTooltip && (
                        <TooltipProvider>
                            <Tooltip content={titleTooltip} asChild>
                                <button
                                    type="button"
                                    aria-label={`${title} help`}
                                    className="inline-flex cursor-help text-kumo-subtle transition-colors hover:text-kumo-default"
                                >
                                    <Info size={14} weight="bold" />
                                </button>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </div>
            )}
            <span
                className={cn(
                    "absolute top-4 right-4 text-xl leading-none font-medium text-kumo-subtle transition-all duration-200 ease-out",
                    isIndexActive ? "scale-100 opacity-100" : "scale-95 opacity-35"
                )}
            >
                {indexMark}
            </span>
            {children}
        </article>
    )
}

export { SettingsCardShell }
