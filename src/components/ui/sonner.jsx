/**
 * [INPUT]: 依赖 sonner, @phosphor-icons/react
 * [OUTPUT]: 对外提供 Toaster 组件
 * [POS]: ui/ Toast 通知组件封装
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { useEffect, useState } from "react"
import {
  CheckCircle,
  Info,
  Spinner,
  WarningCircle,
  XCircle,
} from "@phosphor-icons/react"
import { Toaster as Sonner } from "sonner";

const Toaster = ({
  ...props
}) => {
  const [theme, setTheme] = useState(() => {
    if (typeof document === "undefined") {
      return "light"
    }
    return document.documentElement.dataset.mode || "light"
  })

  useEffect(() => {
    if (typeof document === "undefined") {
      return
    }
    const root = document.documentElement
    const updateTheme = () => {
      setTheme(root.dataset.mode || "light")
    }
    updateTheme()
    const observer = new MutationObserver(updateTheme)
    observer.observe(root, { attributes: true, attributeFilter: ["data-mode"] })
    return () => observer.disconnect()
  }, [])

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      icons={{
        success: <CheckCircle className="size-4" weight="bold" />,
        info: <Info className="size-4" weight="bold" />,
        warning: <WarningCircle className="size-4" weight="bold" />,
        error: <XCircle className="size-4" weight="bold" />,
        loading: <Spinner className="size-4 animate-spin" weight="bold" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)"
        }
      }
      {...props} />
  );
}

export { Toaster }
