/**
 * [INPUT]: 依赖 react-aria-components, @internationalized/date, @phosphor-icons/react,
 *          @/components/ui/select, @/components/ui/button, @/lib/utils,
 *          @base-ui/react FloatingPortal (internal, for portal redirection)
 * [OUTPUT]: JollyCalendar, JollyRangeCalendar, MonthYearPicker (日历组件，基于 react-aria)
 * [POS]: ui/ 日历组件，支持单选、范围选择、月份/年份快速选择
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import * as React from "react"
import { getLocalTimeZone, today } from "@internationalized/date"
import { CaretLeft, CaretRight } from "@phosphor-icons/react"
import {
  Button as AriaButton,
  Calendar as AriaCalendar,
  CalendarCell as AriaCalendarCell,
  CalendarGrid as AriaCalendarGrid,
  CalendarGridBody as AriaCalendarGridBody,
  CalendarGridHeader as AriaCalendarGridHeader,
  CalendarHeaderCell as AriaCalendarHeaderCell,
  CalendarStateContext,
  Heading as AriaHeading,
  RangeCalendar as AriaRangeCalendar,
  RangeCalendarStateContext as AriaRangeCalendarStateContext,
  composeRenderProps,
  Text,
  useLocale,
} from "react-aria-components";
import { FloatingPortal } from "#base-ui-portal"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Select } from "@/components/ui/select"

const Calendar = AriaCalendar

const RangeCalendar = AriaRangeCalendar

/* ========================================================================
   Month and Year Picker - 月份/年份快速选择
   FloatingPortal 包裹: 将 Kumo Select 的 portal 重定向到 popover 内部,
   避免 AriaPopover 的 ariaHideOutside 给外部 portal 加 inert
   ======================================================================== */
function MonthYearPicker({
  minYear,
  maxYear,
}) {
  const state = React.useContext(CalendarStateContext)
  const portalRef = React.useRef(null)

  if (!state) return null

  const months = React.useMemo(() => {
    const formatter = new Intl.DateTimeFormat(state.locale, { month: "long" })
    return Array.from({ length: 12 }, (_, index) => {
      const date = state.focusedDate.set({ month: index + 1 })
      return {
        value: index + 1,
        label: formatter.format(date.toDate(state.timeZone)),
      }
    })
  }, [state.focusedDate, state.locale, state.timeZone])

  const years = React.useMemo(() => {
    const currentYear = state.focusedDate.year
    const startYear = minYear ?? currentYear - 100
    const endYear = maxYear ?? currentYear + 20
    const range = []
    for (let i = startYear; i <= endYear; i++) {
      range.push(i)
    }
    return range
  }, [maxYear, minYear, state.focusedDate.year])

  return (
    <div className="flex gap-2 px-1 pb-2" onClick={(e) => e.stopPropagation()}>
      <FloatingPortal container={portalRef}>
        <Select
          value={state.focusedDate.month.toString()}
          renderValue={(value) => {
            const option = months.find((month) => month.value.toString() === String(value))
            return option?.label ?? value
          }}
          onValueChange={(value) => {
            if (value == null) return
            const nextValue = Number.parseInt(String(value), 10)
            state.setFocusedDate(state.focusedDate.set({ month: nextValue }))
          }}
          className="h-8 flex-1"
        >
          {months.map((month) => (
            <Select.Option key={month.value} value={month.value.toString()}>
              {month.label}
            </Select.Option>
          ))}
        </Select>

        <Select
          value={state.focusedDate.year.toString()}
          onValueChange={(value) => {
            if (value == null) return
            const nextValue = Number.parseInt(String(value), 10)
            state.setFocusedDate(state.focusedDate.set({ year: nextValue }))
          }}
          className="h-8 w-24"
        >
          {years.map((year) => (
            <Select.Option key={year} value={year.toString()}>
              {year}
            </Select.Option>
          ))}
        </Select>
      </FloatingPortal>
      {/* Select portal 重定向目标：下拉菜单渲染到这里（popover 内部） */}
      <div ref={portalRef} className="absolute z-100" />
    </div>
  )
}

const CalendarHeading = (props) => {
  let { direction } = useLocale()

  return (
    <header className="flex w-full items-center gap-1 px-1 pb-4" {...props}>
      <AriaButton
        slot="previous"
        className={cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50",
          /* Hover */
          "data-hovered:opacity-100"
        )}>
        {direction === "rtl" ? (
          <CaretRight aria-hidden className="size-4" />
        ) : (
          <CaretLeft aria-hidden className="size-4" />
        )}
      </AriaButton>
      <AriaHeading className="grow text-center text-sm font-medium" />
      <AriaButton
        slot="next"
        className={cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50",
          /* Hover */
          "data-hovered:opacity-100"
        )}>
        {direction === "rtl" ? (
          <CaretLeft aria-hidden className="size-4" />
        ) : (
          <CaretRight aria-hidden className="size-4" />
        )}
      </AriaButton>
    </header>
  );
}

const CalendarGrid = ({
  className,
  ...props
}) => (
  <AriaCalendarGrid
    className={cn(" border-separate border-spacing-x-0 border-spacing-y-1 ", className)}
    {...props} />
)

const CalendarGridHeader = ({
  ...props
}) => (
  <AriaCalendarGridHeader {...props} />
)

const CalendarHeaderCell = ({
  className,
  ...props
}) => (
  <AriaCalendarHeaderCell
    className={cn(
      "w-9 rounded-md text-[0.8rem] font-normal text-muted-foreground",
      className
    )}
    {...props} />
)

const CalendarGridBody = ({
  className,
  ...props
}) => (
  <AriaCalendarGridBody className={cn("[&>tr>td]:p-0", className)} {...props} />
)

const CalendarCell = ({
  className,
  ...props
}) => {
  const isRange = Boolean(React.useContext(AriaRangeCalendarStateContext))
  return (
    <AriaCalendarCell
      className={composeRenderProps(className, (className, renderProps) =>
        cn(
          buttonVariants({ variant: "ghost" }),
          "relative flex size-9 items-center justify-center p-0 text-sm font-normal",
          /* Disabled */
          renderProps.isDisabled && "text-muted-foreground opacity-50",
          /* Selected */
          renderProps.isSelected &&
          "bg-primary text-primary-foreground data-focused:bg-primary  data-focused:text-primary-foreground",
          /* Hover */
          renderProps.isHovered &&
          renderProps.isSelected &&
          (renderProps.isSelectionStart ||
            renderProps.isSelectionEnd ||
            !isRange) &&
          "data-hovered:bg-primary data-hovered:text-primary-foreground",
          /* Selection Start/End */
          renderProps.isSelected &&
          isRange &&
          !renderProps.isSelectionStart &&
          !renderProps.isSelectionEnd &&
          "rounded-none bg-accent text-accent-foreground",
          /* Outside Month */
          renderProps.isOutsideMonth &&
          "text-muted-foreground opacity-50 data-selected:bg-accent/50 data-selected:text-muted-foreground data-selected:opacity-30",
          /* Current Date */
          renderProps.date.compare(today(getLocalTimeZone())) === 0 &&
          !renderProps.isSelected &&
          "bg-accent text-accent-foreground",
          /* Unavailable Date */
          renderProps.isUnavailable && "cursor-default text-destructive ",
          renderProps.isInvalid &&
          "bg-destructive text-destructive-foreground data-focused:bg-destructive data-hovered:bg-destructive data-focused:text-destructive-foreground data-hovered:text-destructive-foreground",
          className
        ))}
      {...props} />
  );
}

function JollyCalendar(
  {
    errorMessage,
    className,
    ...props
  }
) {
  return (
    <Calendar
      className={composeRenderProps(className, (className) =>
        cn("w-fit", className))}
      {...props}>
      <CalendarHeading />
      <CalendarGrid>
        <CalendarGridHeader>
          {(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}
        </CalendarGridHeader>
        <CalendarGridBody>
          {(date) => <CalendarCell date={date} />}
        </CalendarGridBody>
      </CalendarGrid>
      {errorMessage && (
        <Text className="text-sm text-destructive" slot="errorMessage">
          {errorMessage}
        </Text>
      )}
    </Calendar>
  );
}

function JollyRangeCalendar(
  {
    errorMessage,
    className,
    ...props
  }
) {
  return (
    <RangeCalendar
      className={composeRenderProps(className, (className) =>
        cn("w-fit", className))}
      {...props}>
      <CalendarHeading />
      <CalendarGrid>
        <CalendarGridHeader>
          {(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}
        </CalendarGridHeader>
        <CalendarGridBody>
          {(date) => <CalendarCell date={date} />}
        </CalendarGridBody>
      </CalendarGrid>
      {errorMessage && (
        <Text slot="errorMessage" className="text-sm text-destructive">
          {errorMessage}
        </Text>
      )}
    </RangeCalendar>
  );
}

export {
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  CalendarHeading,
  MonthYearPicker,
  RangeCalendar,
  JollyCalendar,
  JollyRangeCalendar,
}
