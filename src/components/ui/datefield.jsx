/**
 * [INPUT]: 依赖 react-aria-components
 * [OUTPUT]: JollyDateField, JollyTimeField, DateInput, DateSegment (日期/时间输入组件)
 * [POS]: ui/ 日期输入字段，支持键盘输入和格式化
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
"use client";
import {
  DateField as AriaDateField,
  DateInput as AriaDateInput,
  DateSegment as AriaDateSegment,
  TimeField as AriaTimeField,
  composeRenderProps,
  Text,
} from "react-aria-components";

import { cn } from "@/lib/utils"

import { FieldError, fieldGroupVariants, Label } from "./field"

const DateField = AriaDateField

const TimeField = AriaTimeField

function DateSegment({
  className,
  ...props
}) {
  return (
    <AriaDateSegment
      className={composeRenderProps(className, (className) =>
        cn(
          "type-literal:px-0 inline rounded-sm p-0.5 caret-transparent outline-0",
          /* Placeholder */
          "data-placeholder:text-muted-foreground",
          /* Disabled */
          "data-disabled:cursor-not-allowed data-disabled:opacity-50",
          /* Focused */
          "data-focused:bg-accent data-focused:text-accent-foreground",
          /* Invalid */
          "data-invalid:data-focused:bg-destructive data-invalid:data-focused:data-placeholder:text-destructive-foreground data-invalid:data-focused:text-destructive-foreground data-invalid:data-placeholder:text-destructive data-invalid:text-destructive",
          className
        ))}
      {...props} />
  );
}

function DateInput({
  className,
  variant,
  ...props
}) {
  return (
    <AriaDateInput
      className={composeRenderProps(className, (className) =>
        cn(fieldGroupVariants({ variant }), "text-sm", className))}
      {...props}>
      {(segment) => <DateSegment segment={segment} />}
    </AriaDateInput>
  );
}

function JollyDateField(
  {
    label,
    description,
    className,
    errorMessage,
    ...props
  }
) {
  return (
    <DateField
      className={composeRenderProps(className, (className) =>
        cn("group flex flex-col gap-2", className))}
      {...props}>
      <Label>{label}</Label>
      <DateInput />
      {description && (
        <Text className="text-sm text-muted-foreground" slot="description">
          {description}
        </Text>
      )}
      <FieldError>{errorMessage}</FieldError>
    </DateField>
  );
}

function JollyTimeField(
  {
    label,
    description,
    errorMessage,
    className,
    ...props
  }
) {
  return (
    <TimeField
      className={composeRenderProps(className, (className) =>
        cn("group flex flex-col gap-2", className))}
      {...props}>
      <Label>{label}</Label>
      <DateInput />
      {description && <Text slot="description">{description}</Text>}
      <FieldError>{errorMessage}</FieldError>
    </TimeField>
  );
}

export {
  DateField,
  DateSegment,
  DateInput,
  TimeField,
  JollyDateField,
  JollyTimeField,
}
