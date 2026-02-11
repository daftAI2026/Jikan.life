/**
 * [INPUT]: 依赖 @cloudflare/kumo (Button, Text), @phosphor-icons/react
 * [OUTPUT]: 对外提供 RegistryOverview 首屏区域
 * [POS]: pages/registry/sections 的概览区域
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { Button, Text } from "@cloudflare/kumo"
import { Globe } from "@phosphor-icons/react"

function RegistryOverview() {
    return (
        <section id="overview" className="space-y-6">
            <Text variant="heading1">Kumo UI</Text>
            <Text variant="secondary" className="max-w-2xl">
                Kumo is Cloudflare&apos;s component library for building modern web
                applications. This page mirrors the core UI/UX structure of Kumo&apos;s
                documentation site.
            </Text>
            <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary">Get started</Button>
                <Button variant="secondary" icon={Globe}>
                    View docs
                </Button>
            </div>
        </section>
    )
}

export { RegistryOverview }
