/**
 * [INPUT]: 无运行时依赖
 * [OUTPUT]: 对外提供设备可见性策略常量与判断函数（VISIBLE_DEVICE_CATEGORIES、PRIMARY_VISIBLE_DEVICE_CATEGORY、isVisibleDeviceCategory）
 * [POS]: workspace 的设备可见性单一真相源，被设备卡渲染层与配置状态层共享
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
const VISIBLE_DEVICE_CATEGORIES = Object.freeze(["iPhone"])

const PRIMARY_VISIBLE_DEVICE_CATEGORY = VISIBLE_DEVICE_CATEGORIES[0]

function isVisibleDeviceCategory(category) {
    return typeof category === "string" && VISIBLE_DEVICE_CATEGORIES.includes(category)
}

export {
    VISIBLE_DEVICE_CATEGORIES,
    PRIMARY_VISIBLE_DEVICE_CATEGORY,
    isVisibleDeviceCategory,
}
