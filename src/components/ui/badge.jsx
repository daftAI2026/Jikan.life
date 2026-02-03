/**
 * [INPUT]: variant (default/secondary/destructive/outline/gradient), className
 * [OUTPUT]: 微拟物风格徽章组件（渐变背景）
 * [POS]: UI基础层 - 标签原语，支持渐变与立体效果
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

/* ========================================
   徽章样式配置 - 渐变 + 微拟物
   使用 CSS 变量实现主题感知阴影
   ======================================== */

const BADGE_STYLES = {
  default: {
    background: 'linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 80%, black) 100%)',
    boxShadow: '0 2px 6px color-mix(in srgb, var(--primary) 30%, transparent), var(--neumorphic-highlight)',
  },
  secondary: {
    background: 'linear-gradient(135deg, var(--secondary) 0%, color-mix(in srgb, var(--secondary) 85%, black) 100%)',
    boxShadow: 'var(--neumorphic-badge-sm), var(--neumorphic-badge-highlight)',
  },
  destructive: {
    background: 'linear-gradient(135deg, var(--destructive) 0%, color-mix(in srgb, var(--destructive) 80%, black) 100%)',
    boxShadow: '0 2px 6px color-mix(in srgb, var(--destructive) 30%, transparent), var(--neumorphic-highlight)',
  },
  outline: {
    background: 'transparent',
    boxShadow: 'var(--neumorphic-badge-highlight)',
  },
  gradient: {
    background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
    boxShadow: '0 2px 8px color-mix(in srgb, var(--primary) 25%, transparent), inset 0 1px 0 hsl(0 0% 100% / 0.2)',
  },
}

const badgeVariants = cva(
  "inline-flex items-center rounded-xl px-3 py-1 text-xs font-medium transition-all duration-200",
  {
    variants: {
      variant: {
        default: "text-primary-foreground",
        secondary: "text-secondary-foreground",
        destructive: "text-destructive-foreground",
        outline: "border border-input text-foreground",
        gradient: "text-primary-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant = "default", style, ...props }) {
  const styleConfig = BADGE_STYLES[variant] || BADGE_STYLES.default
  const needsCustomStyle = variant !== 'outline'

  const combinedStyle = needsCustomStyle ? {
    background: styleConfig.background,
    boxShadow: styleConfig.boxShadow,
    ...style,
  } : style

  return (
    <div
      className={cn(badgeVariants({ variant }), className)}
      style={combinedStyle}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
