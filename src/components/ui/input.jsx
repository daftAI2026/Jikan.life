/**
 * [INPUT]: className, type, ...props
 * [OUTPUT]: Apple 级交互输入框组件（Spring focus 反馈）
 * [POS]: UI基础层 - 表单原语，内凹阴影 + focus 动效
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { gentle } from "@/lib/motion"

/* ========================================
   输入框样式 - 内凹微拟物效果
   使用 CSS 变量实现主题感知阴影
   ======================================== */

const INPUT_STYLE = {
  boxShadow: 'var(--neumorphic-input)',
  focusBoxShadow: 'var(--neumorphic-input-focus)',
}

const Input = React.forwardRef(({ className, type, style, ...props }, ref) => {
  const [isFocused, setIsFocused] = React.useState(false)

  const combinedStyle = {
    boxShadow: isFocused ? INPUT_STYLE.focusBoxShadow : INPUT_STYLE.boxShadow,
    ...style,
  }

  return (
    <motion.input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-4 py-2 text-base",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        "placeholder:text-muted-foreground",
        "focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "md:text-sm",
        className
      )}
      style={combinedStyle}
      ref={ref}
      onFocus={(e) => { setIsFocused(true); props.onFocus?.(e) }}
      onBlur={(e) => { setIsFocused(false); props.onBlur?.(e) }}
      animate={{
        scale: isFocused ? 1.01 : 1,
      }}
      transition={gentle}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
