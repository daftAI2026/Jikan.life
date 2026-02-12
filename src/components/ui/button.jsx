/**
 * [INPUT]: 依赖 @cloudflare/kumo Button、@radix-ui/react-slot、react-aria(mergeProps/usePress)、react-aria-components(ButtonContext)，兼容旧 variant/size/asChild/isLoading/leftIcon/rightIcon API
 * [OUTPUT]: Kumo Button 适配层（兼容旧 API）
 * [POS]: UI 基础层 - 统一按钮入口，转接 @cloudflare/kumo
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { Button as KumoButton } from "@cloudflare/kumo/components/button"
import { Spinner } from "@phosphor-icons/react"
import { cva } from "class-variance-authority"
import { mergeProps, usePress } from "react-aria"
import { ButtonContext } from "react-aria-components"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition",
  {
    variants: {
      variant: {
        default: "bg-kumo-brand text-kumo-default",
        primary: "bg-kumo-brand text-kumo-default",
        accent: "bg-kumo-brand text-kumo-default",
        secondary: "bg-kumo-elevated text-kumo-default",
        outline: "border border-kumo-line bg-kumo-base text-kumo-default",
        ghost: "bg-transparent text-kumo-default hover:bg-kumo-elevated",
        link: "bg-transparent text-kumo-brand underline-offset-4 hover:underline",
        destructive: "bg-kumo-danger text-kumo-default",
        "secondary-destructive": "border border-kumo-line bg-kumo-base text-kumo-danger",
      },
      size: {
        xs: "h-7 px-2 text-xs",
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

const KUMO_VARIANTS = new Set([
  "primary",
  "secondary",
  "ghost",
  "destructive",
  "secondary-destructive",
  "outline",
])

const KUMO_SIZES = new Set(["xs", "sm", "base", "lg"])
const KUMO_SHAPES = new Set(["base", "square", "circle"])

const LEGACY_VARIANT_TO_KUMO_VARIANT = {
  default: "secondary",
  primary: "primary",
  secondary: "secondary",
  destructive: "destructive",
  outline: "outline",
  ghost: "ghost",
  link: "ghost",
  accent: "primary",
}

const LEGACY_SIZE_TO_KUMO_SIZE = {
  sm: "sm",
  default: "base",
  md: "lg",
  lg: "lg",
  xl: "lg",
  icon: "lg",
}

const resolveKumoVariant = (variant) => {
  const mappedVariant = LEGACY_VARIANT_TO_KUMO_VARIANT[variant] ?? variant
  return KUMO_VARIANTS.has(mappedVariant) ? mappedVariant : "secondary"
}

const resolveKumoSize = (size) => {
  const mappedSize = LEGACY_SIZE_TO_KUMO_SIZE[size] ?? size
  return KUMO_SIZES.has(mappedSize) ? mappedSize : "base"
}

const resolveKumoShape = (shape, size) => {
  const mappedShape = shape ?? (size === "icon" ? "square" : "base")
  return KUMO_SHAPES.has(mappedShape) ? mappedShape : "base"
}

const Button = React.forwardRef(({
  className,
  variant = "default",
  size = "default",
  shape,
  asChild = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  disabled: disabledProp,
  onPress,
  onClick,
  ...props
}, ref) => {
  const domRef = React.useRef(null)
  React.useImperativeHandle(ref, () => domRef.current)

  const contextProps = React.useContext(ButtonContext) || {}
  const {
    onPress: contextOnPress,
    isDisabled: contextIsDisabled,
    className: contextClassName,
    ...contextRest
  } = contextProps

  const disabled = Boolean(disabledProp || isLoading || contextIsDisabled)
  const resolvedVariant = resolveKumoVariant(variant)
  const resolvedSize = resolveKumoSize(size)
  const resolvedShape = resolveKumoShape(shape, size)

  const { pressProps } = usePress({
    ref: domRef,
    isDisabled: disabled,
    onPress: (event) => {
      contextOnPress?.(event)
      onPress?.(event)
      onClick?.(event)
    },
  })

  const mergedProps = mergeProps(contextRest, props, pressProps)
  const { className: _mergedClassName, ...domProps } = mergedProps

  if (asChild) {
    return (
      <Slot
        ref={domRef}
        aria-disabled={disabled || undefined}
        className={cn(
          buttonVariants({ variant, size }),
          contextClassName,
          disabled && "pointer-events-none opacity-50",
          className
        )}
        {...domProps}
      >
        {isLoading ? <Spinner className="h-4 w-4 animate-spin" weight="bold" /> : leftIcon}
        {children}
        {!isLoading && rightIcon}
      </Slot>
    )
  }

  return (
    <KumoButton
      ref={domRef}
      variant={resolvedVariant}
      size={resolvedSize}
      shape={resolvedShape}
      disabled={disabled}
      className={cn(contextClassName, className)}
      {...domProps}
    >
      {isLoading ? <Spinner className="h-4 w-4 animate-spin" weight="bold" /> : leftIcon}
      {children}
      {!isLoading && rightIcon}
    </KumoButton>
  )
})

Button.displayName = "Button"

export { Button, buttonVariants }
