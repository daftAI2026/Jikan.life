/**
 * [INPUT]: 无
 * [OUTPUT]: 对外提供 Skeleton 组件
 * [POS]: ui/ 骨架屏组件，用于加载占位
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props} />
  );
}

export { Skeleton }
