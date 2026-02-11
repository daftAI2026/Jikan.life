/**
 * [INPUT]: variant, size, isLoading, leftIcon, rightIcon, asChild, className
 * [OUTPUT]: Kumo Button 适配层（兼容旧 API）
 * [POS]: UI 基础层 - 统一按钮入口，转接 @cloudflare/kumo
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { forwardRef } from "react"
import { Button as KumoButton } from "@cloudflare/kumo/components/button"
import { Spinner } from "@phosphor-icons/react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition",
  {
    variants: {
      variant: {
        default: "bg-kumo-brand text-kumo-default",
        primary: "bg-kumo-brand text-kumo-default",
        secondary: "bg-kumo-elevated text-kumo-default",
        outline: "border border-kumo-line bg-kumo-base text-kumo-default",
        ghost: "bg-transparent text-kumo-default hover:bg-kumo-elevated",
        link: "bg-transparent text-kumo-brand underline-offset-4 hover:underline",
        destructive: "bg-kumo-danger text-kumo-default",
      },
      size: {
        sm: "h-8 px-3",
        default: "h-9 px-4",
        md: "h-10 px-5",
        lg: "h-12 px-6",
        xl: "h-14 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = forwardRef(({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  ...props
}, ref) => {
  return (
    <KumoButton
      ref={ref}
      variant={variant}
      size={size}
      asChild={asChild}
      className={cn(className)}
      {...props}
    >
      {isLoading ? <Spinner className="h-4 w-4 animate-spin" weight="bold" /> : leftIcon}
      {children}
      {!isLoading && rightIcon}
    </KumoButton>
  )
})

Button.displayName = "Button"

export { Button, buttonVariants }
