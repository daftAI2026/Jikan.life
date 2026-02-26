/**
 * [INPUT]: 依赖 react(useEffect) 与 document.documentElement
 * [OUTPUT]: 对外提供 useRegistryBlockingScrollLock(active)（Registry 阻断层滚动锁，引用计数）
 * [POS]: pages/registry/sections 的滚动治理基础设施，被 SetupGuide 与移动侧栏抽屉复用
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { useEffect } from "react"

const REGISTRY_BLOCKING_ATTR = "data-registry-blocking"
let registryBlockingLockCount = 0

function applyRegistryBlockingAttr() {
    document.documentElement.setAttribute(REGISTRY_BLOCKING_ATTR, "true")
}

function releaseRegistryBlockingAttr() {
    document.documentElement.removeAttribute(REGISTRY_BLOCKING_ATTR)
}

function useRegistryBlockingScrollLock(active) {
    useEffect(() => {
        if (!active || typeof document === "undefined") return

        registryBlockingLockCount += 1
        if (registryBlockingLockCount === 1) {
            applyRegistryBlockingAttr()
        }

        return () => {
            registryBlockingLockCount = Math.max(0, registryBlockingLockCount - 1)
            if (registryBlockingLockCount === 0) {
                releaseRegistryBlockingAttr()
            }
        }
    }, [active])
}

export { useRegistryBlockingScrollLock }
