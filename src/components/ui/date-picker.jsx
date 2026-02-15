/**
 * [INPUT]: 依赖 react-aria-components, @internationalized/date, @phosphor-icons/react
 * [OUTPUT]: JollyDatePicker, JollyDateRangePicker (带输入框的日期选择器)
 * [POS]: UI组件层 - 日期选择器，基于 react-aria-components，弹窗背景使用 bg-kumo-control 对齐 Kumo Select
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
"use client";
import { Calendar as CalendarIcon } from "@phosphor-icons/react"
import {
  DatePicker as AriaDatePicker,
  DateRangePicker as AriaDateRangePicker,
  Dialog as AriaDialog,
  Popover as AriaPopover,
  composeRenderProps,
  Text,
} from "react-aria-components";

import { cn } from "@/lib/utils"

import { Button } from "./button"
import {
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  CalendarHeading,
  RangeCalendar,
} from "./calendar"
import { DateInput } from "./datefield"
import { FieldError, FieldGroup, Label } from "./field"

const DatePicker = AriaDatePicker

const DateRangePicker = AriaDateRangePicker

/* ========================================================================
   DatePickerContent
   使用 AriaPopover（非 Kumo Popover）确保与 react-aria DatePicker 状态集成
   默认 isDismissable=true: 点外部关闭弹窗
   ======================================================================== */
const DatePickerContent = ({
  className,
  popoverClassName,
  ...props
}) => (
  <AriaPopover
    offset={8}
    className={composeRenderProps(popoverClassName, (className) =>
      cn(
        "z-50 w-auto rounded-xl ring ring-kumo-line bg-kumo-control p-3 text-kumo-default shadow-md outline-none",
        "data-entering:animate-in data-entering:fade-in-0 data-entering:zoom-in-95",
        "data-exiting:animate-out data-exiting:fade-out-0 data-exiting:zoom-out-95",
        "data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2",
        className
      ))}>
    <AriaDialog
      className={cn(
        "flex w-full flex-col space-y-4 outline-none sm:flex-row sm:space-x-4 sm:space-y-0",
        className
      )}
      {...props} />
  </AriaPopover>
)

function JollyDatePicker(
  {
    label,
    description,
    errorMessage,
    className,
    ...props
  }
) {
  return (
    <DatePicker
      className={composeRenderProps(className, (className) =>
        cn("group flex flex-col gap-2", className))}
      {...props}>
      <Label>{label}</Label>
      <FieldGroup>
        <DateInput className="flex-1" variant="ghost" />
        <Button
          variant="ghost"
          size="icon"
          className="mr-1 size-6 data-focus-visible:ring-offset-0">
          <CalendarIcon aria-hidden className="size-4" weight="bold" />
        </Button>
      </FieldGroup>
      {description && (
        <Text className="text-sm text-muted-foreground" slot="description">
          {description}
        </Text>
      )}
      <FieldError>{errorMessage}</FieldError>
      <DatePickerContent>
        <Calendar>
          <CalendarHeading />
          <CalendarGrid>
            <CalendarGridHeader>
              {(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}
            </CalendarGridHeader>
            <CalendarGridBody>
              {(date) => <CalendarCell date={date} />}
            </CalendarGridBody>
          </CalendarGrid>
        </Calendar>
      </DatePickerContent>
    </DatePicker>
  );
}

function JollyDateRangePicker(
  {
    label,
    description,
    errorMessage,
    className,
    ...props
  }
) {
  return (
    <DateRangePicker
      className={composeRenderProps(className, (className) =>
        cn("group flex flex-col gap-2", className))}
      {...props}>
      <Label>{label}</Label>
      <FieldGroup>
        <DateInput variant="ghost" slot={"start"} />
        <span aria-hidden className="px-2 text-sm text-muted-foreground">
          -
        </span>
        <DateInput className="flex-1" variant="ghost" slot={"end"} />

        <Button
          variant="ghost"
          size="icon"
          className="mr-1 size-6 data-focus-visible:ring-offset-0">
          <CalendarIcon aria-hidden className="size-4" />
        </Button>
      </FieldGroup>
      {description && (
        <Text className="text-sm text-muted-foreground" slot="description">
          {description}
        </Text>
      )}
      <FieldError>{errorMessage}</FieldError>
      <DatePickerContent>
        <RangeCalendar>
          <CalendarHeading />
          <CalendarGrid>
            <CalendarGridHeader>
              {(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}
            </CalendarGridHeader>
            <CalendarGridBody>
              {(date) => <CalendarCell date={date} />}
            </CalendarGridBody>
          </CalendarGrid>
        </RangeCalendar>
      </DatePickerContent>
    </DateRangePicker>
  );
}

export {
  DatePicker,
  DatePickerContent,
  DateRangePicker,
  JollyDatePicker,
  JollyDateRangePicker,
}
