/**
 * [INPUT]: 依赖 @/components/ui/kumo (Badge, Button, Surface, Text), registry-data
 * [OUTPUT]: 对外提供 RegistryBlocks 区块示例
 * [POS]: pages/registry/sections 的区块示例集合
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { Badge, Button, Surface, Text } from "@/components/ui/kumo"
import { RESOURCE_ITEMS } from "../registry-data"
import { RegistrySection } from "./RegistrySection"

function RegistryBlocks() {
    return (
        <>
            <RegistrySection id="page-header" title="Page Header" description="Page header block">
                <Surface className="rounded-xl border border-kumo-line bg-kumo-base p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <Text variant="heading2">Workers Analytics</Text>
                            <Text variant="secondary">Monitor traffic and performance metrics.</Text>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="secondary">Export</Button>
                            <Button variant="primary">Create report</Button>
                        </div>
                    </div>
                </Surface>
            </RegistrySection>

            <RegistrySection id="resource-list" title="Resource List" description="Resource list block">
                <Surface className="rounded-xl border border-kumo-line bg-kumo-base p-0">
                    <div className="divide-y divide-kumo-line">
                        {RESOURCE_ITEMS.map((item) => (
                            <div key={item.name} className="flex items-center justify-between px-6 py-4">
                                <div>
                                    <Text bold>{item.name}</Text>
                                    <Text variant="secondary">{item.usage}</Text>
                                </div>
                                <Badge variant={item.status === "Active" ? "primary" : "outline"}>
                                    {item.status}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </Surface>
            </RegistrySection>
        </>
    )
}

export { RegistryBlocks }
