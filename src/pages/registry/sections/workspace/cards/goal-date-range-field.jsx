/**
 * [INPUT]: 依赖 Kumo DatePicker/Popover/Button、shared goal 日期约束常量、 useDateFnsLocale
 * [OUTPUT]: 对外提供 GoalDateRangeField（Goal 第③卡的区间日期选择器，含 Next 30/90 days presets）
 * [POS]: workspace/cards 的 Goal 日期字段组件，承接官方 DatePicker(range) 本体与 presets 交互
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { Button, DatePicker } from "@/components/ui/kumo"
import { Popover } from "@/components/ui/popover"
import { useDateFnsLocale } from "@/lib/I18nContext"
import { formatCaption as defaultFormatCaption } from "react-day-picker"
import {
    GOAL_START_MIN_ISO,
    GOAL_TARGET_MAX_ISO,
    isValidISODateString,
} from "../../../../../../shared/wallpaper-core"

/* ── Pangu: CJK 与 ASCII 之间插入空格 ────────────────────── */
const CJK = "\u4e00-\u9fff\u3400-\u4dbf\u3040-\u309f\u30a0-\u30ff"
const PANGU_RE_AFTER = new RegExp(`([${CJK}])([A-Za-z0-9])`, "g")
const PANGU_RE_BEFORE = new RegExp(`([A-Za-z0-9])([${CJK}])`, "g")
const pangu = (s) => s.replace(PANGU_RE_AFTER, "$1 $2").replace(PANGU_RE_BEFORE, "$1 $2")

function toLocalDate(isoDate) {
    if (!isValidISODateString(isoDate)) return undefined
    const [year, month, day] = isoDate.split("-").map(Number)
    return new Date(year, month - 1, day)
}

function toISODate(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
}

function addDays(date, days) {
    const next = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    next.setDate(next.getDate() + days)
    return next
}

function getTodayDate() {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

function getRangeLabel({ startISO, endISO, t }) {
    if (startISO && endISO) return `${startISO} -> ${endISO}`
    if (startISO) return `${startISO} -> ...`
    return t("placeholder.selectDateRange")
}

function GoalDateRangeField({ startISO, endISO, onChange, t }) {
    const dateLocale = useDateFnsLocale()
    const startDate = toLocalDate(startISO)
    const endDate = toLocalDate(endISO)
    const minDate = toLocalDate(GOAL_START_MIN_ISO)
    const maxDate = toLocalDate(GOAL_TARGET_MAX_ISO)
    const selectedRange = startDate ? { from: startDate, to: endDate } : undefined
    const today = getTodayDate()

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
                    className="h-9 w-[200px] max-w-full justify-start gap-2 rounded-lg px-3 text-left font-normal"
                >
                    <span className="truncate text-sm">{getRangeLabel({ startISO, endISO, t })}</span>
                </Button>
            </Popover.Trigger>

            <Popover.Content className="w-auto p-3" sideOffset={8} align="start">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <Button variant="secondary" size="sm" onClick={() => handlePresetSelect(0)}>
                            {t("preset.range.today")}
                        </Button>
                        <Button variant="secondary" size="sm" onClick={() => handlePresetSelect(7)}>
                            {t("preset.range.next7")}
                        </Button>
                        <Button variant="secondary" size="sm" onClick={() => handlePresetSelect(30)}>
                            {t("preset.range.next30")}
                        </Button>
                        <Button variant="secondary" size="sm" onClick={() => handlePresetSelect(90)}>
                            {t("preset.range.next90")}
                        </Button>
                    </div>

                    <DatePicker
                        mode="range"
                        selected={selectedRange}
                        onChange={handleDateRangeChange}
                        numberOfMonths={2}
                        locale={dateLocale}
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
