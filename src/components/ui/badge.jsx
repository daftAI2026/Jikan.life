/**
 * [INPUT]: 依赖 @cloudflare/kumo/components/badge
 * [OUTPUT]: 对外提供 Badge 组件
 * [POS]: UI基础层 - 标签原语
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { Badge as KumoBadge } from "@cloudflare/kumo/components/badge"
import { cn } from "@/lib/utils"

function Badge({ className, ...props }) {
  return <KumoBadge className={cn(className)} {...props} />
}

export { Badge }
