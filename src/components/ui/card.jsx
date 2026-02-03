/**
 * [INPUT]: variant (elevated/inset/flat), className, children
 * [OUTPUT]: Apple 级交互卡片组件（Spring 悬浮提升）
 * [POS]: UI基础层 - 容器原语，融合 hoverLift 动效
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { snappy } from "@/lib/motion"

/* ========================================
   卡片样式配置 - 微拟物三变体
   使用 CSS 变量实现主题感知阴影
   ======================================== */

const CARD_STYLES = {
  elevated: {
    boxShadow: 'var(--neumorphic-elevated), var(--neumorphic-highlight)',
    hoverBoxShadow: 'var(--neumorphic-elevated-hover), var(--neumorphic-highlight-hover)',
  },
  inset: {
    boxShadow: 'var(--neumorphic-inset)',
    hoverBoxShadow: 'var(--neumorphic-inset-hover)',
  },
  flat: {
    boxShadow: 'var(--neumorphic-flat)',
    hoverBoxShadow: 'var(--neumorphic-flat-hover)',
  },
}

const Card = React.forwardRef(({
  className,
  variant = "elevated",
  style,
  ...props
}, ref) => {
  const [isHovered, setIsHovered] = React.useState(false)
  const styleConfig = CARD_STYLES[variant] || CARD_STYLES.elevated

  const combinedStyle = {
    boxShadow: isHovered ? styleConfig.hoverBoxShadow : styleConfig.boxShadow,
    ...style,
  }

  // inset 变体不需要悬浮提升效果
  const shouldLift = variant !== 'inset'

  return (
    <motion.div
      ref={ref}
      className={cn(
        "rounded-[20px] border bg-card text-card-foreground",
        className
      )}
      style={combinedStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{
        y: shouldLift && isHovered ? -4 : 0,
        scale: shouldLift && isHovered ? 1.01 : 1,
      }}
      transition={snappy}
      {...props}
    />
  )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
