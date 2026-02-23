/**
 * [INPUT]: 依赖 Input、SettingsCardDatePickerField、goal 日期常量与 Goal actions/config 链路
 * [OUTPUT]: 对外提供 goalFieldsCard 定义（Goal 第③卡）
 * [POS]: workspace/cards 的 Goal 专属字段卡，承接 Goal Name/Start/Target 及错误提示
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { Input } from "@/components/ui/kumo"
import { GOAL_START_MIN_ISO, GOAL_TARGET_MAX_ISO } from "../../../../../../shared/wallpaper-core"
import { SettingsCardDatePickerField } from "./settings-card-date-picker-field"

const goalFieldsCard = {
    title: "Goal",
    render: ({ actions, config, t, todayISO }) => (
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
                <p className="text-xs text-kumo-subtle">{t("config.startDate")}</p>
                <SettingsCardDatePickerField
                    value={config.goalStart}
                    onChange={actions.setGoalStart}
                    minValue={GOAL_START_MIN_ISO}
                    maxValue={GOAL_TARGET_MAX_ISO}
                />
                {config.goalStartError && <p className="text-xs text-kumo-warning">{t(config.goalStartError)}</p>}
            </div>
            <div className="w-[200px] max-w-full space-y-1.5">
                <p className="text-xs text-kumo-subtle">{t("config.targetDate")}</p>
                <SettingsCardDatePickerField
                    value={config.goalDate}
                    onChange={actions.setGoalDate}
                    minValue={config.goalStart || todayISO}
                    maxValue={GOAL_TARGET_MAX_ISO}
                />
                {config.goalDateError && <p className="text-xs text-kumo-warning">{t(config.goalDateError)}</p>}
            </div>
        </div>
    ),
}

export { goalFieldsCard }
