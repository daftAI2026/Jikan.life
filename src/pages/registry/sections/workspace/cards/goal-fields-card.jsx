/**
 * [INPUT]: 依赖 Input、GoalDateRangeField 与 Goal actions/config 链路
 * [OUTPUT]: 对外提供 goalFieldsCard 定义（Goal 第③卡）
 * [POS]: workspace/cards 的 Goal 专属字段卡，承接 Goal Name/Date Range 及错误提示
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { Input } from "@/components/ui/kumo"
import { GoalDateRangeField } from "./goal-date-range-field"

const goalFieldsCard = {
    title: "Goal",
    render: ({ actions, config, t }) => (
        <div className="flex w-full max-w-full flex-col items-center gap-4 px-4 py-1">
            <div className="w-[200px] max-w-full space-y-1.5">
                <p className="text-xs text-kumo-subtle">{t("config.goalName")}</p>
                <Input
                    className="w-[200px] max-w-full"
                    value={config.goalName}
                    onChange={(event) => actions.setGoalName(event.target.value)}
                    placeholder={t("placeholder.goalName")}
                />
            </div>
            <div className="w-[200px] max-w-full space-y-1.5">
                <p className="text-xs text-kumo-subtle">{t("config.dateRange")}</p>
                <GoalDateRangeField
                    startISO={config.goalStart}
                    endISO={config.goalDate}
                    onChange={actions.setGoalRange}
                    t={t}
                />
                {(config.goalStartError || config.goalDateError) && (
                    <p className="text-xs text-kumo-warning">{t(config.goalStartError || config.goalDateError)}</p>
                )}
            </div>
        </div>
    ),
}

export { goalFieldsCard }
