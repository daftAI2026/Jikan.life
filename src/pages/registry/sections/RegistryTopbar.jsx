/**
 * [INPUT]: 无
 * [OUTPUT]: 对外提供 RegistryTopbar 顶部栏
 * [POS]: pages/registry/sections 的顶栏区域，复刻 Kumo Header
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const KUMO_VERSION = "1.5.0"
const KUMO_GITHUB_URL = "https://github.com/cloudflare/kumo"

function RegistryTopbar() {
    return (
        <header className="sticky top-0 z-10 border-b border-kumo-line bg-kumo-elevated md:pr-12">
            <div className="mx-auto hidden h-12 items-center px-4 md:flex md:border-r md:border-kumo-line">
                <a
                    href={KUMO_GITHUB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto font-mono text-sm text-kumo-subtle transition-colors hover:text-kumo-default"
                >
                    @cloudflare/kumo
                    <span className="ml-1 rounded bg-kumo-control px-1.5 py-0.5 text-xs">
                        v{KUMO_VERSION}
                    </span>
                </a>
            </div>
        </header>
    )
}

export { RegistryTopbar }
