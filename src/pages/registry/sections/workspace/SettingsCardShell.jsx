/**
 * [INPUT]: 依赖父层传入 cardId/legacyCardId/title/titleTooltip/indexMark/children、Tooltip 原语与 Kumo token 样式
 * [OUTPUT]: 对外提供 SettingsCardShell 组件（左上标题 + 可选问号提示 + 右上序号 + 居中内容 + 新旧ID兼容选择器）
 * [POS]: registry/sections/workspace 的右侧六卡视觉壳层，复刻 Kumo HomeGrid 单卡骨架
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { Info } from "@phosphor-icons/react"
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip"

function SettingsCardShell({ cardId, legacyCardId, title, titleTooltip, indexMark, children }) {
    return (
        <article
            data-home-settings-card={cardId}
            data-home-settings-card-legacy={legacyCardId}
            className="relative flex min-h-[220px] items-center justify-center bg-kumo-elevated lg:min-h-0"
        >
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
            <span className="absolute top-4 right-4 text-xl leading-none font-medium text-kumo-subtle">{indexMark}</span>
            {children}
        </article>
    )
}

export { SettingsCardShell }
