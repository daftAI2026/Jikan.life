/**
 * [INPUT]: 依赖 components/ComponentGrid
 * [OUTPUT]: 对外提供 RegistryComponents 组件
 * [POS]: pages/registry/sections 的组件墙入口
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { ComponentGrid } from "./components/ComponentGrid"

function RegistryComponents() {
    return (
        <section className="px-6 py-6 lg:px-8" aria-label="Components">
            <ComponentGrid />
        </section>
    )
}

export { RegistryComponents }
