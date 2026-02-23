/**
 * [INPUT]: 依赖 Kumo Select 组件、countryOptions 与 config.country/actions.setCountry
 * [OUTPUT]: 对外提供 locationCard 定义（Location 业务卡）
 * [POS]: workspace/cards 的第①卡业务实现，承接国家选择与时区联动入口
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { Select } from "@/components/ui/kumo"

const locationCard = {
    titleKey: "config.location",
    titleTooltipKey: "config.locationTooltip",
    render: ({ actions, config, countryOptions, t }) => (
        <Select
            className="w-[200px] max-w-full"
            value={config.country}
            onValueChange={(value) => actions.setCountry(value ?? "")}
            renderValue={(value) => {
                if (!value) return t("placeholder.selectCountry")
                const option = countryOptions.find((item) => item.value === value)
                return option?.label ?? value
            }}
        >
            {countryOptions.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                    {option.label}
                </Select.Option>
            ))}
        </Select>
    ),
}

export { locationCard }
