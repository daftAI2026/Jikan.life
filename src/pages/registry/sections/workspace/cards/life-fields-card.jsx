/**
 * [INPUT]: 依赖 Kumo Input/Button/DatePicker、Popover 与 Life actions/config 链路
 * [OUTPUT]: 对外提供 lifeFieldsCard 定义（Life 第③卡）
 * [POS]: workspace/cards 的 Life 专属字段卡，承接 DOB/Lifespan 配置，DOB 走官方 Kumo DatePicker(single)
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { Button, DatePicker, Input } from "@/components/ui/kumo"
import { Popover } from "@/components/ui/popover"

function toLocalDate(isoDate) {
    if (!isoDate) return undefined
    const [year, month, day] = isoDate.split("-").map(Number)
    if (!year || !month || !day) return undefined
    return new Date(year, month - 1, day)
}

function toISODate(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
}

const lifeFieldsCard = {
    title: "Life",
    render: ({ actions, config, t, todayISO }) => {
        const dobDate = toLocalDate(config.dob)
        const todayDate = toLocalDate(todayISO)
        const dobLabel = config.dob || t("placeholder.selectStartDate")

        return (
            <div className="flex w-full max-w-full flex-col items-center gap-4 px-4 py-1">
                <div className="w-[200px] max-w-full space-y-1.5">
                    <div className="inline-flex items-center gap-1 text-xs text-kumo-subtle">
                        <span>{t("config.dateOfBirth")}</span>
                        <span>{t("config.dateOfBirthHint")}</span>
                    </div>
                    <Popover>
                        <Popover.Trigger asChild>
                            <Button
                                variant="outline"
                                className="h-9 w-[200px] max-w-full justify-start gap-2 rounded-lg px-3 text-left font-normal">
                                <span className="truncate text-sm">{dobLabel}</span>
                            </Button>
                        </Popover.Trigger>
                        <Popover.Content className="w-auto p-3" sideOffset={8} align="start">
                            <DatePicker
                                mode="single"
                                selected={dobDate}
                                onChange={(date) => actions.setDob(date ? toISODate(date) : "")}
                                disabled={todayDate ? [{ after: todayDate }] : undefined}
                            />
                        </Popover.Content>
                    </Popover>
                </div>
                <div className="w-[200px] max-w-full space-y-1.5">
                    <div className="inline-flex items-center gap-1 text-xs text-kumo-subtle">
                        <span>{t("config.lifespan")}</span>
                        <span>{t("config.lifespanHint")}</span>
                    </div>
                    <Input
                        className="w-[200px] max-w-full"
                        type="number"
                        min={50}
                        max={120}
                        value={config.lifespan}
                        onChange={(event) => actions.setLifespan(event.target.value)}
                        onBlur={actions.normalizeLifespan}
                    />
                </div>
            </div>
        )
    },
}

export { lifeFieldsCard }
