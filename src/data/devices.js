/**
 * [INPUT]: 无
 * [OUTPUT]: 对外提供 devices 列表与设备查询/归一函数 (normalizeDeviceName, getDevice, getDevicesByCategory, getIPhonesBySeries)
 * [POS]: data/ 静态数据，定义 iPhone/Android/iPad 屏幕规格、notch 参数、**Year布局 cols/padding 覆盖**
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
// Complete device resolutions for wallpapers
// Includes all iPhone models through iPhone 17 series

const IPHONE_DYNAMIC_ISLAND_67 = {
    width: 1290,
    height: 2796,
    category: "iPhone",
    notchHeight: 0.12,
    clockHeight: 0.217,
    cols: 16,
    padding: 0.1797,
}

const IPHONE_DYNAMIC_ISLAND_61 = {
    width: 1179,
    height: 2556,
    category: "iPhone",
    notchHeight: 0.12,
    clockHeight: 0.217,
    cols: 16,
    padding: 0.1797,
}

const IPHONE_DYNAMIC_ISLAND_63 = {
    width: 1206,
    height: 2622,
    category: "iPhone",
    notchHeight: 0.12,
    clockHeight: 0.217,
    cols: 16,
    padding: 0.1797,
}

const IPHONE_DYNAMIC_ISLAND_69 = {
    width: 1320,
    height: 2868,
    category: "iPhone",
    notchHeight: 0.12,
    clockHeight: 0.217,
    cols: 16,
    padding: 0.1797,
}

const IPHONE_DYNAMIC_ISLAND_AIR_67 = {
    width: 1260,
    height: 2736,
    category: "iPhone",
    notchHeight: 0.12,
    clockHeight: 0.217,
    cols: 16,
    padding: 0.1797,
}

const IPHONE_NOTCH_67 = {
    width: 1284,
    height: 2778,
    category: "iPhone",
    notchHeight: 0.11,
    clockHeight: 0.287,
    cols: 16,
    padding: 0.1797,
}

const IPHONE_NOTCH_61 = {
    width: 1170,
    height: 2532,
    category: "iPhone",
    notchHeight: 0.11,
    clockHeight: 0.287,
    cols: 16,
    padding: 0.1797,
}

export const devices = [
    // ===== iPhone 17 Series =====
    {
        name: "iPhone 17 Pro Max",
        ...IPHONE_DYNAMIC_ISLAND_69,
    },
    {
        name: "iPhone 17 Pro",
        ...IPHONE_DYNAMIC_ISLAND_63,
    },
    {
        name: "iPhone 17 Air",
        ...IPHONE_DYNAMIC_ISLAND_AIR_67,
    },
    {
        name: "iPhone 17",
        ...IPHONE_DYNAMIC_ISLAND_63,
    },

    // ===== iPhone 16 Series =====
    {
        name: "iPhone 16 Pro Max",
        ...IPHONE_DYNAMIC_ISLAND_69,
    },
    {
        name: "iPhone 16 Pro",
        ...IPHONE_DYNAMIC_ISLAND_63,
    },
    {
        name: "iPhone 16 Plus",
        ...IPHONE_DYNAMIC_ISLAND_67,
    },
    {
        name: "iPhone 16",
        ...IPHONE_DYNAMIC_ISLAND_61,
    },

    // ===== iPhone 15 Series =====
    {
        name: "iPhone 15 Pro Max",
        ...IPHONE_DYNAMIC_ISLAND_67,
    },
    {
        name: "iPhone 15 Pro",
        ...IPHONE_DYNAMIC_ISLAND_61,
    },
    {
        name: "iPhone 15 Plus",
        ...IPHONE_DYNAMIC_ISLAND_67,
    },
    {
        name: "iPhone 15",
        ...IPHONE_DYNAMIC_ISLAND_61,
    },

    // ===== iPhone 14 Series =====
    {
        name: "iPhone 14 Pro Max",
        ...IPHONE_DYNAMIC_ISLAND_67,
    },
    {
        name: "iPhone 14 Pro",
        ...IPHONE_DYNAMIC_ISLAND_61,
    },
    {
        name: "iPhone 14 Plus",
        ...IPHONE_NOTCH_67,
    },
    {
        name: "iPhone 14",
        ...IPHONE_NOTCH_61,
    },

    // ===== iPhone 13 Series =====
    {
        name: "iPhone 13 Pro Max",
        ...IPHONE_NOTCH_67,
    },
    {
        name: "iPhone 13 Pro",
        ...IPHONE_NOTCH_61,
    },
    {
        name: "iPhone 13",
        ...IPHONE_NOTCH_61,
    },

    // ===== Notch 5.4" (13 mini) =====
    {
        name: "iPhone 13 mini",
        width: 1080,
        height: 2340,
        category: "iPhone",
        notchHeight: 0.11,
        clockHeight: 0.287,
        cols: 16,
        padding: 0.1797
    },

    // ===== iPhone 12 Series =====
    {
        name: "iPhone 12 mini",
        width: 1080,
        height: 2340,
        category: "iPhone",
        notchHeight: 0.11,
        clockHeight: 0.287,
        cols: 16,
        padding: 0.1797
    },

    // ===== iPhone SE =====
    {
        name: "iPhone SE (3rd gen)",
        width: 750,
        height: 1334,
        category: "iPhone",
        notchHeight: 0,
        clockHeight: 0.12
    },

    // ===== Android =====
    {
        name: "Samsung Galaxy S24 Ultra",
        width: 1440,
        height: 3120,
        category: "Android",
        notchHeight: 0.04,
        clockHeight: 0.10
    },
    {
        name: "Samsung Galaxy S24+",
        width: 1440,
        height: 3120,
        category: "Android",
        notchHeight: 0.04,
        clockHeight: 0.10
    },
    {
        name: "Samsung Galaxy S24",
        width: 1080,
        height: 2340,
        category: "Android",
        notchHeight: 0.04,
        clockHeight: 0.10
    },
    {
        name: "Google Pixel 9 Pro XL",
        width: 1344,
        height: 2992,
        category: "Android",
        notchHeight: 0.04,
        clockHeight: 0.10
    },
    {
        name: "Google Pixel 9 Pro",
        width: 1280,
        height: 2856,
        category: "Android",
        notchHeight: 0.04,
        clockHeight: 0.10
    },
    {
        name: "Google Pixel 9",
        width: 1080,
        height: 2424,
        category: "Android",
        notchHeight: 0.04,
        clockHeight: 0.10
    },

    // ===== iPad =====
    {
        name: "iPad Pro 13\"",
        width: 2064,
        height: 2752,
        category: "iPad",
        notchHeight: 0,
        clockHeight: 0.05
    },
    {
        name: "iPad Pro 11\"",
        width: 1668,
        height: 2388,
        category: "iPad",
        notchHeight: 0,
        clockHeight: 0.05
    },
    {
        name: "iPad Air",
        width: 1640,
        height: 2360,
        category: "iPad",
        notchHeight: 0,
        clockHeight: 0.05
    }
];

const LEGACY_DEVICE_NAME_MAP = {
    "iPhone 14 Pro Max / 15 Plus / 15 Pro Max / 16 Plus": "iPhone 14 Pro Max",
    "iPhone 14 Pro / 15 / 15 Pro / 16": "iPhone 14 Pro",
    "iPhone 13 Pro Max / 14 Plus": "iPhone 13 Pro Max",
    "iPhone 13 / 13 Pro / 14": "iPhone 13",
}

export function normalizeDeviceName(deviceName) {
    if (typeof deviceName !== "string") return deviceName
    return LEGACY_DEVICE_NAME_MAP[deviceName] ?? deviceName
}

// Get device by name
export function getDevice(deviceName) {
    const normalizedDeviceName = normalizeDeviceName(deviceName)
    return devices.find(d => d.name === normalizedDeviceName);
}

// Get devices by category
export function getDevicesByCategory(category) {
    return devices.filter(d => d.category === category);
}

// Get all iPhones grouped by series
export function getIPhonesBySeries() {
    const series = {
        '17': [],
        '16': [],
        '15': [],
        '14': [],
        '13': [],
        '12': [],
        'SE': []
    };

    devices.filter(d => d.category === 'iPhone').forEach(device => {
        if (device.name.includes('17')) series['17'].push(device);
        else if (device.name.includes('16')) series['16'].push(device);
        else if (device.name.includes('15')) series['15'].push(device);
        else if (device.name.includes('14')) series['14'].push(device);
        else if (device.name.includes('13')) series['13'].push(device);
        else if (device.name.includes('12')) series['12'].push(device);
        else if (device.name.includes('SE')) series['SE'].push(device);
    });

    return series;
}
