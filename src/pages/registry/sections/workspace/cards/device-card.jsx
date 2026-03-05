/**
 * [INPUT]: 依赖 Kumo Select + Base 分组 Select、devices 数据与 device actions/config 链路
 * [OUTPUT]: 对外提供 deviceCard 定义（Device 业务卡）
 * [POS]: workspace/cards 的设备配置卡，承接机型选择入口；分辨率提示由本地开关控制且默认关闭
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { Select } from "@/components/ui/kumo"
import { Select as SelectBase } from "@base-ui/react/select"
import { devices } from "@/data/devices"
import { VISIBLE_DEVICE_CATEGORIES } from "../device-visibility"

const SHOW_DEVICE_RESOLUTION_HINT = false
const shouldShowGroupLabel = VISIBLE_DEVICE_CATEGORIES.length > 1
const visibleDeviceGroups = VISIBLE_DEVICE_CATEGORIES.map((category) => ({
    category,
    items: devices.filter((device) => device.category === category),
}))

const deviceCard = {
    titleKey: "config.device",
    titleTooltipKey: "config.deviceTooltip",
    render: ({ actions, config, selectedDevice, t }) => (
        <div className="flex w-full max-w-full flex-col items-center gap-1.5 py-1">
            <Select
                className="w-[200px] max-w-full"
                label={t("config.device")}
                description={SHOW_DEVICE_RESOLUTION_HINT ? `${t("config.deviceResolution")}: ${selectedDevice.width} × ${selectedDevice.height}` : undefined}
                value={config.device}
                onValueChange={(value) => {
                    if (value) actions.setDevice(value)
                }}
                renderValue={(value) => value || config.device}
            >
                {visibleDeviceGroups.map((group) => (
                    <SelectBase.Group key={group.category}>
                        {shouldShowGroupLabel && (
                            <SelectBase.GroupLabel className="px-2 py-1.5 text-base font-medium text-kumo-subtle select-none">
                                {group.category}
                            </SelectBase.GroupLabel>
                        )}
                        {group.items.map((device) => (
                            <Select.Option key={device.name} value={device.name}>
                                {device.name}
                            </Select.Option>
                        ))}
                    </SelectBase.Group>
                ))}
            </Select>
        </div>
    ),
}

export { deviceCard }
