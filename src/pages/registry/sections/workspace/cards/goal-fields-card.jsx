/**
 * [INPUT]: 依赖 Input、GoalDateRangeField 与 Goal actions/config 链路
 * [OUTPUT]: 对外提供 goalFieldsCard 定义（Goal 第③卡）
 * [POS]: workspace/cards 的 Goal 专属字段卡，承接 Goal Name/Date Range 及错误提示
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { Input } from "@/components/ui/kumo"
import { CardField, CardFieldsStack } from "./CardField"
import { GoalDateRangeField } from "./goal-date-range-field"

const goalFieldsCard = {
    title: "Goal",
    render: ({ actions, config, t }) => (
        <CardFieldsStack>
            <CardField label={t("config.goalName")} labelClassName="block">
                <Input
                    className="w-[200px] max-w-full"
                    value={config.goalName}
                    onChange={(event) => actions.setGoalName(event.target.value)}
                    placeholder={t("placeholder.goalName")}
                    aria-label={t("config.goalName")}
                />
            </CardField>
            <CardField label={t("config.dateRange")} labelClassName="block">
                <GoalDateRangeField
                    startISO={config.goalStart}
                    endISO={config.goalDate}
                    onChange={actions.setGoalRange}
                    t={t}
                />
                {(config.goalStartError || config.goalDateError) && (
                    <p className="text-xs text-kumo-warning">{t(config.goalStartError || config.goalDateError)}</p>
                )}
            </CardField>
        </CardFieldsStack>
    ),
}

export { goalFieldsCard }
