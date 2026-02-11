/**
 * [INPUT]: 依赖 @cloudflare/kumo/components/input
 * [OUTPUT]: 对外提供 Input 组件
 * [POS]: UI基础层 - 表单输入原语
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { forwardRef } from "react"
import { Input as KumoInput } from "@cloudflare/kumo/components/input"
import { cn } from "@/lib/utils"

const Input = forwardRef(({ className, ...props }, ref) => {
  return <KumoInput ref={ref} className={cn(className)} {...props} />
})

Input.displayName = "Input"

export { Input }
