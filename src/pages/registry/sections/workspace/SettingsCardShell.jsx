/**
 * [INPUT]: 依赖父层传入 cardId/title/children 与 Kumo token 样式
 * [OUTPUT]: 对外提供 SettingsCardShell 组件（左上标题 + 居中内容 + 稳定测试选择器）
 * [POS]: registry/sections/workspace 的右侧六卡视觉壳层，复刻 Kumo HomeGrid 单卡骨架
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

function SettingsCardShell({ cardId, title, indexMark, children }) {
    return (
        <article
            data-home-settings-card={cardId}
            className="relative flex min-h-[220px] items-center justify-center bg-kumo-elevated lg:min-h-0"
        >
            <h3 className="absolute top-4 left-4 text-base font-medium text-kumo-subtle">{title}</h3>
            <span className="absolute top-4 right-4 text-xl leading-none font-medium text-kumo-subtle">{indexMark}</span>
            {children}
        </article>
    )
}

export { SettingsCardShell }
