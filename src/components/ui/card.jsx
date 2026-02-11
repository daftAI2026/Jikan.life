/**
 * [INPUT]: variant (elevated/inset/flat), className, children
 * [OUTPUT]: Kumo Surface 卡片适配层
 * [POS]: UI基础层 - 容器原语，统一卡片外观
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { forwardRef } from "react"
import { Surface } from "@cloudflare/kumo/components/surface"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const cardVariants = cva(
  "rounded-xl border border-kumo-line text-kumo-default",
  {
    variants: {
      variant: {
        elevated: "bg-kumo-elevated shadow-sm",
        inset: "bg-kumo-recessed",
        flat: "bg-kumo-base",
      },
    },
    defaultVariants: {
      variant: "elevated",
    },
  }
)

const Card = forwardRef(({ className, variant = "elevated", ...props }, ref) => (
  <Surface ref={ref} className={cn(cardVariants({ variant }), className)} {...props} />
))
Card.displayName = "Card"

const CardHeader = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
))
CardHeader.displayName = "CardHeader"

const CardTitle = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("font-semibold leading-none tracking-tight", className)} {...props} />
))
CardTitle.displayName = "CardTitle"

const CardDescription = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("text-sm text-kumo-subtle", className)} {...props} />
))
CardDescription.displayName = "CardDescription"

const CardContent = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
