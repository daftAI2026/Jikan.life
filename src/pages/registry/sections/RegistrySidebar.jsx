/**
 * [INPUT]: 依赖 vendor/kumo SidebarNav 实现
 * [OUTPUT]: 对外提供 RegistrySidebar 侧边栏导航薄包装
 * [POS]: pages/registry/sections 的同源适配层，避免手写偏差
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { SidebarNav as VendorSidebarNav } from "../../../../vendor/kumo/packages/kumo-docs-astro/src/components/SidebarNav"

function RegistrySidebar({ currentPath }) {
    return <VendorSidebarNav currentPath={currentPath} />
}

export { RegistrySidebar }
