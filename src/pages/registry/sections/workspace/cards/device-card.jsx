/**
 * [INPUT]: 依赖 Kumo Select + Base 分组 Select、devices 数据与 device actions/config 链路
 * [OUTPUT]: 对外提供 deviceCard 定义（Device 业务卡）
 * [POS]: workspace/cards 的设备配置卡，承接机型选择与分辨率提示
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { Select } from "@/components/ui/kumo"
import { Select as SelectBase } from "@base-ui/react/select"
import { devices } from "@/data/devices"
import { VISIBLE_DEVICE_CATEGORIES } from "../device-visibility"

const deviceCard = {
    titleKey: "config.device",
    titleTooltipKey: "config.deviceTooltip",
    render: ({ actions, config, selectedDevice }) => (
        <div className="flex w-full max-w-full flex-col items-center gap-1.5 py-1">
            <Select
                className="w-[200px] max-w-full"
                value={config.device}
                onValueChange={(value) => {
                    if (value) actions.setDevice(value)
                }}
                renderValue={(value) => value || config.device}
            >
                {VISIBLE_DEVICE_CATEGORIES.map((category) => (
                    <SelectBase.Group key={category}>
                        <SelectBase.GroupLabel className="px-2 py-1.5 text-base font-medium text-kumo-subtle select-none">
                            {category}
                        </SelectBase.GroupLabel>
                        {devices
                            .filter((device) => device.category === category)
                            .map((device) => (
                                <Select.Option key={device.name} value={device.name}>
                                    {device.name}
                                </Select.Option>
                            ))}
                    </SelectBase.Group>
                ))}
            </Select>
            <p className="w-[200px] max-w-full pl-[12px] text-xs text-kumo-subtle">
                {selectedDevice.width} × {selectedDevice.height}
            </p>
        </div>
    ),
}

export { deviceCard }
