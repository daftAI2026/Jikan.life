/**
 * [INPUT]: variant, size, isLoading, leftIcon, rightIcon, asChild, className
 * [OUTPUT]: Apple 级交互按钮组件（Spring 物理 + 微拟物）
 * [POS]: UI基础层 - 核心交互原语，融合 Spring 动效
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { snappy } from "@/lib/motion"

/* ========================================
   按钮样式配置 - 渐变 + 立体效果
   ======================================== */

const BUTTON_STYLES = {
  default: {
    background: 'linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 85%, black) 50%, color-mix(in srgb, var(--primary) 70%, black) 100%)',
    boxShadow: '0 4px 12px color-mix(in srgb, var(--primary) 35%, transparent), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.1)',
    hoverBoxShadow: '0 6px 20px color-mix(in srgb, var(--primary) 45%, transparent), inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.15)',
  },
  primary: {
    background: 'linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 85%, black) 50%, color-mix(in srgb, var(--primary) 70%, black) 100%)',
    boxShadow: '0 4px 12px color-mix(in srgb, var(--primary) 35%, transparent), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.1)',
    hoverBoxShadow: '0 6px 20px color-mix(in srgb, var(--primary) 45%, transparent), inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.15)',
  },
  destructive: {
    background: 'linear-gradient(135deg, var(--destructive) 0%, color-mix(in srgb, var(--destructive) 85%, black) 50%, color-mix(in srgb, var(--destructive) 70%, black) 100%)',
    boxShadow: '0 4px 12px color-mix(in srgb, var(--destructive) 35%, transparent), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.1)',
    hoverBoxShadow: '0 6px 20px color-mix(in srgb, var(--destructive) 45%, transparent), inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.15)',
  },
  accent: {
    background: 'linear-gradient(135deg, var(--accent) 0%, color-mix(in srgb, var(--accent) 85%, black) 50%, color-mix(in srgb, var(--accent) 70%, black) 100%)',
    boxShadow: '0 4px 12px color-mix(in srgb, var(--accent) 35%, transparent), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.1)',
    hoverBoxShadow: '0 6px 20px color-mix(in srgb, var(--accent) 45%, transparent), inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.15)',
  },
  secondary: {
    background: 'linear-gradient(135deg, var(--secondary) 0%, color-mix(in srgb, var(--secondary) 90%, black) 50%, color-mix(in srgb, var(--secondary) 80%, black) 100%)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.05)',
    hoverBoxShadow: '0 4px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.08)',
  },
  outline: {
    background: 'transparent',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.05)',
    hoverBoxShadow: '0 2px 6px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.08)',
  },
  ghost: {
    background: 'transparent',
    boxShadow: 'none',
    hoverBoxShadow: 'none',
  },
  link: {
    background: 'transparent',
    boxShadow: 'none',
    hoverBoxShadow: 'none',
  },
}

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "whitespace-nowrap text-sm font-medium",
    "rounded-xl",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "text-primary-foreground",
        primary: "text-primary-foreground",
        destructive: "text-destructive-foreground",
        accent: "text-accent-foreground",
        secondary: "text-secondary-foreground",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 px-4 text-xs",
        default: "h-9 px-5 py-2",
        md: "h-10 px-6 py-2.5",
        lg: "h-12 px-10",
        xl: "h-14 px-12 py-4 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  style,
  ...props
}, ref) => {
  const [isHovered, setIsHovered] = React.useState(false)
  const [isPressed, setIsPressed] = React.useState(false)

  const styleConfig = BUTTON_STYLES[variant] || BUTTON_STYLES.default
  const needsCustomStyle = !['ghost', 'link'].includes(variant)

  const combinedStyle = needsCustomStyle ? {
    background: styleConfig.background,
    boxShadow: isHovered ? styleConfig.hoverBoxShadow : styleConfig.boxShadow,
    ...style,
  } : style

  // asChild 时使用 Slot，否则使用 motion.button
  if (asChild) {
    return (
      <Slot
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        style={combinedStyle}
        {...props}
      >
        {children}
      </Slot>
    )
  }

  return (
    <motion.button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      disabled={isLoading || props.disabled}
      style={combinedStyle}
      onMouseEnter={(e) => { setIsHovered(true); props.onMouseEnter?.(e) }}
      onMouseLeave={(e) => { setIsHovered(false); setIsPressed(false); props.onMouseLeave?.(e) }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      animate={{
        scale: isPressed ? 0.96 : isHovered ? 1.02 : 1,
        y: isHovered && !isPressed ? -2 : 0,
      }}
      transition={snappy}
      whileTap={{ scale: 0.96 }}
      {...props}
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : leftIcon}
      {children}
      {!isLoading && rightIcon}
    </motion.button>
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }
