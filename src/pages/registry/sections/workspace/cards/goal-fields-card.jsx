/**
 * [INPUT]: 依赖 Input、GoalDateRangeField 与 Goal actions/config/effectiveLayoutTier 链路
 * [OUTPUT]: 对外提供 goalFieldsCard 定义（Goal 第③卡）
 * [POS]: workspace/cards 的 Goal 专属字段卡，承接 Goal Name/Date Range 及错误提示（effective mid 时 Goal 切换为等宽左右并排）
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { Input } from "@/components/ui/kumo"
import { CardField, CardFieldsStack } from "./CardField"
import { GoalDateRangeField } from "./goal-date-range-field"

const goalFieldsCard = {
    titleKey: "config.goal",
    render: ({ actions, config, effectiveLayoutTier, t }) => {
        const isMidGoal = effectiveLayoutTier === "mid" && config.selectedType === "goal"

        if (isMidGoal) {
            return (
                <div className="w-full px-4 py-1">
                    <div className="grid w-full max-w-full grid-cols-2 items-start gap-2">
                        <CardField label={t("config.goalName")} labelClassName="block" className="min-w-0 w-full">
                            <Input
                                className="w-full"
                                value={config.goalName}
                                onChange={(event) => actions.setGoalName(event.target.value)}
                                placeholder={t("placeholder.goalName")}
                                aria-label={t("config.goalName")}
                            />
                        </CardField>
                        <CardField label={t("config.dateRange")} labelClassName="block" className="min-w-0 w-full">
                            <GoalDateRangeField
                                startISO={config.goalStart}
                                endISO={config.goalDate}
                                onChange={actions.setGoalRange}
                                t={t}
                                triggerClassName="h-9 w-full justify-start gap-2 rounded-lg px-3 text-left font-normal"
                            />
                            {(config.goalStartError || config.goalDateError) && (
                                <p className="text-xs text-kumo-warning">{t(config.goalStartError || config.goalDateError)}</p>
                            )}
                        </CardField>
                    </div>
                </div>
            )
        }

        return (
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
        )
    },
}

export { goalFieldsCard }
