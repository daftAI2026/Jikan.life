/**
 * [INPUT]: 依赖 @/components/ui/calendar, @/components/ui/popover, @/components/ui/button
 * [OUTPUT]: DatePicker 组件 (shadcn 官方模式: Popover + Calendar)
 * [POS]: UI组件层 - 日期选择器，使用设计系统标准模式
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

function DatePicker({ value, onChange, placeholder = "Pick a date", disabled, className, minDate, maxDate }) {
    // 将字符串日期转换为 Date 对象
    const selectedDate = value ? new Date(value) : undefined

    const handleSelect = (date) => {
        if (date) {
            // 输出为 ISO 日期字符串 (YYYY-MM-DD)
            const isoDate = format(date, "yyyy-MM-dd")
            onChange(isoDate)
        }
    }

    // 构建日期禁用函数
    const disabledMatcher = React.useMemo(() => {
        const matchers = []
        if (minDate) {
            // 禁用 minDate 之前的所有日期
            matchers.push({ before: minDate })
        }
        if (maxDate) {
            // 禁用 maxDate 之后的所有日期
            matchers.push({ after: maxDate })
        }
        return matchers.length > 0 ? matchers : undefined
    }, [minDate, maxDate])

    // 计算年份范围
    const fromYear = minDate?.getFullYear() || 1900
    const toYear = maxDate?.getFullYear() || 2100

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !value && "text-muted-foreground",
                        className
                    )}
                    disabled={disabled}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {value ? format(selectedDate, "PPP") : <span>{placeholder}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    captionLayout="dropdown"
                    selected={selectedDate}
                    onSelect={handleSelect}
                    disabled={disabledMatcher}
                    fromYear={fromYear}
                    toYear={toYear}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}

export { DatePicker }
