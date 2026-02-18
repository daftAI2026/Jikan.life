/**
 * [INPUT]: 依赖 react(useEffect/useState), @/components/ui/kumo(Button), @phosphor-icons/react(SunIcon/MoonIcon)
 * [OUTPUT]: 对外提供 ThemeToggle 主题切换按钮（light/dark）
 * [POS]: registry/sections 的本地主题开关实现，避免跨包引用 vendor docs 源码导致构建耦合
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/kumo"
import { MoonIcon, SunIcon } from "@phosphor-icons/react"

const MODES = new Set(["light", "dark"])

function getStoredMode() {
    if (typeof window === "undefined") return null

    const mode = localStorage.getItem("mode")
    return MODES.has(mode) ? mode : null
}

function getInitialMode() {
    if (typeof window === "undefined") return "light"

    const stored = getStoredMode()
    if (stored) return stored

    const attrMode = document.documentElement.getAttribute("data-mode")
    if (MODES.has(attrMode)) return attrMode

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function ThemeToggle() {
    const [mode, setMode] = useState(getInitialMode)

    useEffect(() => {
        if (typeof document === "undefined") return

        document.documentElement.setAttribute("data-mode", mode)
        localStorage.setItem("mode", mode)
    }, [mode])

    const toggleMode = () => {
        setMode((prev) => (prev === "dark" ? "light" : "dark"))
    }

    return (
        <Button
            variant="ghost"
            shape="square"
            aria-label={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
            onClick={toggleMode}
        >
            {mode === "light" ? <MoonIcon size={20} /> : <SunIcon size={20} />}
        </Button>
    )
}

export { ThemeToggle }
