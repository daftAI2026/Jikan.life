/**
 * [INPUT]: 依赖 react-aria-components 的 FieldError/Group/Label/Text/composeRenderProps，依赖 class-variance-authority 的 cva，依赖 @/lib/utils 的 cn
 * [OUTPUT]: 对外提供 Label/labelVariants/FieldGroup/fieldGroupVariants/FieldError/FormDescription
 * [POS]: components/ui 的表单字段基础层，被 datefield 等表单控件复用
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { cva } from "class-variance-authority";
import {
  FieldError as AriaFieldError,
  Group as AriaGroup,
  Label as AriaLabel,
  Text as AriaText,
  composeRenderProps,
} from "react-aria-components";

import { cn } from "@/lib/utils"

const labelVariants = cva([
  "text-sm font-medium leading-none",
  /* Disabled */
  "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-70",
  /* Invalid */
  "group-data-[invalid]:text-destructive",
])

function Label({
  className,
  ...props
}) {
  return <AriaLabel className={cn(labelVariants(), className)} {...props} />
}

function FormDescription({
  className,
  ...props
}) {
  return (
    <AriaText
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
      slot="description" />
  );
}

function FieldError({
  className,
  ...props
}) {
  return (
    <AriaFieldError
      className={cn("text-sm font-medium text-destructive", className)}
      {...props} />
  );
}

const fieldGroupVariants = cva("", {
  variants: {
    variant: {
      default: [
        "relative flex h-10 w-full items-center overflow-hidden rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
        "[box-shadow:var(--neumorphic-input)]",
        /* Focus Within */
        "data-[focus-within]:outline-none data-[focus-within]:ring-2 data-[focus-within]:ring-ring data-[focus-within]:ring-offset-2",
        "data-[focus-within]:[box-shadow:var(--neumorphic-input-focus)]",
        /* Disabled */
        "data-[disabled]:opacity-50",
      ],
      ghost: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

function FieldGroup({
  className,
  variant,
  ...props
}) {
  return (
    <AriaGroup
      className={composeRenderProps(className, (className) =>
        cn(fieldGroupVariants({ variant }), className))}
      {...props} />
  );
}

export {
  Label,
  labelVariants,
  FieldGroup,
  fieldGroupVariants,
  FieldError,
  FormDescription,
}
