/**
 * [INPUT]: 依赖 @internationalized/date(parseDate)、@phosphor-icons/react(CalendarIcon)、日期组件(DatePicker/DateInput/Calendar)
 * [OUTPUT]: 对外提供 SettingsCardDatePickerField（Setting Panel 卡片专用日期输入，固定 200px 宽度与视觉 token）
 * [POS]: workspace/cards 的基础字段组件，被 goal-fields 与 life-fields 卡复用
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { Calendar as CalendarIcon } from "@phosphor-icons/react"
import { parseDate } from "@internationalized/date"
import { DatePicker, DatePickerContent } from "@/components/ui/date-picker"
import { DateInput } from "@/components/ui/datefield"
import {
    Calendar,
    CalendarCell,
    CalendarGrid,
    CalendarGridBody,
    CalendarGridHeader,
    CalendarHeaderCell,
    CalendarHeading,
    MonthYearPicker,
} from "@/components/ui/calendar"
import { FieldGroup } from "@/components/ui/field"
import { Button } from "@/components/ui/button"

const CARD_DATE_FIELD_GROUP_CLASS_NAME =
    "flex h-9 w-[200px] max-w-full items-center gap-2 rounded-lg border-0 bg-kumo-control px-3 text-base ring ring-kumo-line shadow-none data-[focus-within]:ring-1 data-[focus-within]:ring-kumo-ring data-[focus-within]:ring-offset-0"
const CARD_DATE_INPUT_CLASS_NAME = "min-w-0 flex-1 bg-transparent px-0 text-base text-kumo-default whitespace-nowrap"
const CARD_DATE_TRIGGER_CLASS_NAME =
    "size-5 shrink-0 self-center bg-transparent p-0 text-kumo-default hover:bg-transparent focus-visible:ring-0"

function SettingsCardDatePickerField({ value, onChange, minValue, maxValue }) {
    return (
        <DatePicker
            className="w-[200px] max-w-full"
            value={value ? parseDate(value) : null}
            onChange={(date) => onChange(date ? date.toString() : "")}
            minValue={minValue ? parseDate(minValue) : undefined}
            maxValue={maxValue ? parseDate(maxValue) : undefined}
        >
            <FieldGroup className={CARD_DATE_FIELD_GROUP_CLASS_NAME} variant="ghost">
                <DateInput className={CARD_DATE_INPUT_CLASS_NAME} variant="ghost" />
                <Button slot="trigger" variant="ghost" size="icon" className={CARD_DATE_TRIGGER_CLASS_NAME}>
                    <CalendarIcon aria-hidden className="size-4" />
                </Button>
            </FieldGroup>
            <DatePickerContent>
                <Calendar>
                    <CalendarHeading />
                    <MonthYearPicker />
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
    )
}

export { SettingsCardDatePickerField }
