/**
 * [INPUT]: 依赖 Input、SettingsCardDatePickerField 与 Life actions/config 链路
 * [OUTPUT]: 对外提供 lifeFieldsCard 定义（Life 第③卡）
 * [POS]: workspace/cards 的 Life 专属字段卡，承接 DOB/Lifespan 配置
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { Input } from "@/components/ui/kumo"
import { SettingsCardDatePickerField } from "./settings-card-date-picker-field"

const lifeFieldsCard = {
    title: "Life",
    render: ({ actions, config, t, todayISO }) => (
        <div className="flex w-full max-w-full flex-col items-center gap-4 px-4 py-1">
            <div className="w-[200px] max-w-full space-y-1.5">
                <div className="inline-flex items-center gap-1 text-xs text-kumo-subtle">
                    <span>{t("config.dateOfBirth")}</span>
                    <span>{t("config.dateOfBirthHint")}</span>
                </div>
                <SettingsCardDatePickerField
                    value={config.dob}
                    onChange={actions.setDob}
                    maxValue={todayISO}
                />
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
    ),
}

export { lifeFieldsCard }
