/**
 * [INPUT]: 依赖 react(useEffect/useState)、Kumo DatePicker/Popover/Button、shared goal 日期约束常量、useDateFnsLocale、cn、浏览器 matchMedia
 * [OUTPUT]: 对外提供 GoalDateRangeField（Goal 第③卡的区间日期选择器，支持堆叠态收口与 presets 裁剪）
 * [POS]: workspace/cards 的 Goal 日期字段组件，承接官方 DatePicker(range) 本体与 presets 交互；使用 viewport 驱动的 compact/wide 模式切换弹层宽度、对齐与 preset 裁剪，并跟随 DayPicker CSS 变量推导日历宽度
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { useEffect, useState } from "react"
import { Button, DatePicker } from "@/components/ui/kumo"
import { Popover } from "@/components/ui/popover"
import { useDateFnsLocale } from "@/lib/I18nContext"
import { cn } from "@/lib/utils"
import { addDays, getLocalTodayISO, toISODate, toLocalDate } from "@/lib/date-utils"
import { formatCaption as defaultFormatCaption } from "react-day-picker"
import {
    GOAL_START_MIN_ISO,
    GOAL_TARGET_MAX_ISO,
} from "../../../../../../shared/wallpaper-core"

/* ── Pangu: CJK 与 ASCII 之间插入空格 ────────────────────── */
const CJK = "\u4e00-\u9fff\u3400-\u4dbf\u3040-\u309f\u30a0-\u30ff"
const PANGU_RE_AFTER = new RegExp(`([${CJK}])([A-Za-z0-9])`, "g")
const PANGU_RE_BEFORE = new RegExp(`([A-Za-z0-9])([${CJK}])`, "g")
const pangu = (s) => s.replace(PANGU_RE_AFTER, "$1 $2").replace(PANGU_RE_BEFORE, "$1 $2")
const GOAL_RANGE_COMPACT_BREAKPOINT_PX = 568
const GOAL_RANGE_DAY_WIDTH_CSS = "var(--rdp-day-width)"
const GOAL_RANGE_MONTHS_GAP_CSS = "var(--rdp-months-gap)"
const GOAL_RANGE_POPOVER_PADDING_X_PX = 24
const GOAL_RANGE_COMPACT_CALENDAR_WIDTH_CSS = `calc(
    ${GOAL_RANGE_DAY_WIDTH_CSS} +
    ${GOAL_RANGE_DAY_WIDTH_CSS} +
    ${GOAL_RANGE_DAY_WIDTH_CSS} +
    ${GOAL_RANGE_DAY_WIDTH_CSS} +
    ${GOAL_RANGE_DAY_WIDTH_CSS} +
    ${GOAL_RANGE_DAY_WIDTH_CSS} +
    ${GOAL_RANGE_DAY_WIDTH_CSS}
)`
const GOAL_RANGE_COMPACT_POPOVER_WIDTH_CSS = `calc(${GOAL_RANGE_COMPACT_CALENDAR_WIDTH_CSS} + ${GOAL_RANGE_POPOVER_PADDING_X_PX}px)`
const GOAL_RANGE_WIDE_POPOVER_WIDTH_CSS = `calc(${GOAL_RANGE_COMPACT_CALENDAR_WIDTH_CSS} + ${GOAL_RANGE_COMPACT_CALENDAR_WIDTH_CSS} + ${GOAL_RANGE_MONTHS_GAP_CSS} + ${GOAL_RANGE_POPOVER_PADDING_X_PX}px)`
const PRESETS = [
    { id: "today", labelKey: "preset.range.today", days: 0 },
    { id: "next7", labelKey: "preset.range.next7", days: 7 },
    { id: "next30", labelKey: "preset.range.next30", days: 30 },
    { id: "next90", labelKey: "preset.range.next90", days: 90 },
]

function isCompactGoalRangeViewport() {
    if (typeof window === "undefined") return false
    return window.matchMedia(`(max-width: ${GOAL_RANGE_COMPACT_BREAKPOINT_PX}px)`).matches
}

function getRangeLabel({ startISO, endISO, t }) {
    if (startISO && endISO) return `${startISO} -> ${endISO}`
    if (startISO) return `${startISO} -> ...`
    return t("placeholder.selectDateRange")
}

function GoalDateRangeField({ startISO, endISO, onChange, t, triggerClassName }) {
    const dateLocale = useDateFnsLocale()
    const startDate = toLocalDate(startISO)
    const endDate = toLocalDate(endISO)
    const minDate = toLocalDate(GOAL_START_MIN_ISO)
    const maxDate = toLocalDate(GOAL_TARGET_MAX_ISO)
    const selectedRange = startDate ? { from: startDate, to: endDate } : undefined
    const today = toLocalDate(getLocalTodayISO()) || new Date()
    const [isCompactViewport, setIsCompactViewport] = useState(() => isCompactGoalRangeViewport())
    const popoverWidth = isCompactViewport ? GOAL_RANGE_COMPACT_POPOVER_WIDTH_CSS : GOAL_RANGE_WIDE_POPOVER_WIDTH_CSS
    const datePickerStyles = isCompactViewport
        ? {
              root: { width: GOAL_RANGE_COMPACT_CALENDAR_WIDTH_CSS },
              months: {
                  width: GOAL_RANGE_COMPACT_CALENDAR_WIDTH_CSS,
                  maxWidth: GOAL_RANGE_COMPACT_CALENDAR_WIDTH_CSS,
              },
          }
        : undefined
    const visiblePresets = isCompactViewport ? PRESETS.filter(({ id }) => id !== "next90") : PRESETS

    useEffect(() => {
        if (typeof window === "undefined") return undefined

        const mediaQuery = window.matchMedia(`(max-width: ${GOAL_RANGE_COMPACT_BREAKPOINT_PX}px)`)
        const handleViewportChange = (event) => {
            setIsCompactViewport(event.matches)
        }

        setIsCompactViewport(mediaQuery.matches)

        if (typeof mediaQuery.addEventListener === "function") {
            mediaQuery.addEventListener("change", handleViewportChange)
            return () => mediaQuery.removeEventListener("change", handleViewportChange)
        }

        mediaQuery.addListener(handleViewportChange)
        return () => mediaQuery.removeListener(handleViewportChange)
    }, [])

    const handleDateRangeChange = (range) => {
        if (!range?.from) {
            onChange({ startISO: "", endISO: "" })
            return
        }
        onChange({
            startISO: toISODate(range.from),
            endISO: range.to ? toISODate(range.to) : "",
        })
    }

    const handlePresetSelect = (days) => {
        const nextDate = addDays(today, days)
        onChange({
            startISO: toISODate(today),
            endISO: toISODate(nextDate),
        })
    }

    return (
        <Popover>
            <Popover.Trigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "h-9 w-[200px] max-w-full justify-start gap-2 rounded-lg px-3 text-left font-normal",
                        triggerClassName
                    )}
                >
                    <span className="truncate text-sm">{getRangeLabel({ startISO, endISO, t })}</span>
                </Button>
            </Popover.Trigger>

            <Popover.Content
                className="w-auto p-3"
                sideOffset={8}
                align={isCompactViewport ? "center" : "start"}
                style={{ width: popoverWidth }}
            >
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        {visiblePresets.map((preset) => (
                            <Button
                                key={preset.id}
                                data-preset={preset.id}
                                variant="secondary"
                                size="sm"
                                onClick={() => handlePresetSelect(preset.days)}
                            >
                                {t(preset.labelKey)}
                            </Button>
                        ))}
                    </div>

                    <DatePicker
                        mode="range"
                        selected={selectedRange}
                        onChange={handleDateRangeChange}
                        numberOfMonths={2}
                        locale={dateLocale}
                        styles={datePickerStyles}
                        formatters={{
                            formatCaption: (date, options, dateLib) =>
                                pangu(defaultFormatCaption(date, options, dateLib)),
                        }}
                        disabled={[{ before: minDate }, { after: maxDate }]}
                    />
                </div>
            </Popover.Content>
        </Popover>
    )
}

export { GoalDateRangeField }
