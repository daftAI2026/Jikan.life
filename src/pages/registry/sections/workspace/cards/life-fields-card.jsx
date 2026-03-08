/**
 * [INPUT]: 依赖 Kumo Input/Button/DatePicker、Popover 与 Life actions/config 链路
 * [OUTPUT]: 对外提供 lifeFieldsCard 定义（Life 第③卡）
 * [POS]: workspace/cards 的 Life 专属字段卡，承接 DOB/Lifespan 配置，DOB 走官方 Kumo DatePicker(single)
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { Button, DatePicker, Input } from "@/components/ui/kumo"
import { Popover } from "@/components/ui/popover"
import { toISODate, toLocalDate } from "@/lib/date-utils"
import { CardField, CardFieldsStack } from "./CardField"

const lifeFieldsCard = {
    titleKey: "config.life",
    render: ({ actions, config, t, todayISO }) => {
        const dobDate = toLocalDate(config.dob)
        const todayDate = toLocalDate(todayISO)
        const dobLabel = config.dob || t("placeholder.selectStartDate")

        return (
            <CardFieldsStack>
                <CardField label={t("config.dateOfBirth")} hint={t("config.dateOfBirthHint")}>
                    <Popover>
                        <Popover.Trigger asChild>
                            <Button
                                variant="outline"
                                className="h-9 w-[200px] max-w-full justify-start gap-2 rounded-lg px-3 text-left font-normal"
                            >
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
                </CardField>
                <CardField label={t("config.lifespan")} hint={t("config.lifespanHint")}>
                    <Input
                        className="w-[200px] max-w-full"
                        type="number"
                        min={50}
                        max={120}
                        value={config.lifespan}
                        onChange={(event) => actions.setLifespan(event.target.value)}
                        onBlur={actions.normalizeLifespan}
                        aria-label={t("config.lifespan")}
                    />
                </CardField>
            </CardFieldsStack>
        )
    },
}

export { lifeFieldsCard }
