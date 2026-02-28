/**
 * [INPUT]: 依赖 @cloudflare/kumo/components/input
 * [OUTPUT]: 对外提供 Input 组件（统一可访问名称兜底）
 * [POS]: UI基础层 - 表单输入原语，集中收敛 label/aria-label 契约
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { forwardRef } from "react"
import { Input as KumoInput } from "@cloudflare/kumo/components/input"
import { cn } from "@/lib/utils"

const Input = forwardRef(({ className, ...props }, ref) => {
  const hasAccessibleName = Boolean(
    props.label || props["aria-label"] || props["aria-labelledby"]
  )
  const fallbackAriaLabel =
    !hasAccessibleName && typeof props.placeholder === "string"
      ? props.placeholder
      : undefined

  return (
    <KumoInput
      ref={ref}
      className={cn(className)}
      {...props}
      aria-label={props["aria-label"] ?? fallbackAriaLabel}
    />
  )
})

Input.displayName = "Input"

export { Input }
