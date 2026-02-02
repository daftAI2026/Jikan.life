/**
 * [INPUT]: 无外部依赖
 * [OUTPUT]: Apple 级 Framer Motion 动画预设库
 * [POS]: 工具层 - 动画系统核心，供所有组件复用
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

/* ========================================
   Apple 风格 Spring 配置
   ======================================== */

/** 标准交互 - 按钮、卡片 hover (~200ms 体感) */
export const snappy = { type: "spring", stiffness: 400, damping: 30 }

/** 柔和过渡 - 面板展开、模态框 (~350ms 体感) */
export const gentle = { type: "spring", stiffness: 300, damping: 35 }

/** 弹性强调 - 成功反馈、关键元素 (~300ms 体感) */
export const bouncy = { type: "spring", stiffness: 500, damping: 25, mass: 0.8 }

/** 优雅落定 - 页面过渡、大元素移动 (~500ms 体感) */
export const smooth = { type: "spring", stiffness: 200, damping: 40, mass: 1.2 }

/** 惯性滑动 - 列表、轮播 */
export const inertia = { type: "spring", stiffness: 150, damping: 20, mass: 0.5 }

/* ========================================
   Apple 缓动曲线 (非 Spring 场景)
   ======================================== */

/** iOS 标准曲线 */
export const appleEase = [0.25, 0.1, 0.25, 1.0]

/** iOS 弹出曲线 */
export const appleEaseOut = [0.22, 1, 0.36, 1]

/** iOS 减速曲线 */
export const appleDecelerate = [0, 0, 0.2, 1]

/* ========================================
   入场动画变体 (Spring 版)
   ======================================== */

/** 淡入上移 - 标准进场动画 */
export const fadeInUp = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 30
        }
    }
}

/** 淡入 - 纯透明度变化 */
export const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 35
        }
    }
}

/** 弹性缩放 - 强调元素进场 */
export const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 25
        }
    }
}

/** 左滑入 */
export const slideInLeft = {
    hidden: { opacity: 0, x: -30 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 30
        }
    }
}

/** 右滑入 */
export const slideInRight = {
    hidden: { opacity: 0, x: 30 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 30
        }
    }
}

/* ========================================
   容器动画变体 (Stagger)
   ======================================== */

/** 标准 stagger 容器 */
export const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.06,
            delayChildren: 0.1
        }
    }
}

/** 快速 stagger 容器 */
export const staggerContainerFast = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.03,
            delayChildren: 0.05
        }
    }
}

/** stagger 子元素 */
export const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 350,
            damping: 30
        }
    }
}

/* ========================================
   交互动画变体
   ======================================== */

/** 悬浮提升 (Apple Card 效果) */
export const hoverLift = {
    rest: {
        scale: 1,
        y: 0,
    },
    hover: {
        scale: 1.02,
        y: -4,
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 25
        }
    }
}

/** 点击反馈 (弹性回弹) */
export const tapScale = {
    rest: { scale: 1 },
    pressed: {
        scale: 0.96,
        transition: {
            type: "spring",
            stiffness: 500,
            damping: 30
        }
    }
}

/** 轻触反馈 (微缩) */
export const tapScaleLight = {
    rest: { scale: 1 },
    pressed: {
        scale: 0.98,
        transition: {
            type: "spring",
            stiffness: 500,
            damping: 30
        }
    }
}

/* ========================================
   模态框动画
   ======================================== */

/** 模态背景 */
export const modalOverlay = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.2, ease: appleEase }
    },
    exit: {
        opacity: 0,
        transition: { duration: 0.15 }
    }
}

/** 模态内容 */
export const modalContent = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 35
        }
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        transition: { duration: 0.15 }
    }
}

/* ========================================
   页面路由过渡
   ======================================== */

/** 页面进场/退场 */
export const pageTransition = {
    initial: { opacity: 0, x: 20 },
    animate: {
        opacity: 1,
        x: 0,
        transition: {
            type: "spring",
            stiffness: 260,
            damping: 40
        }
    },
    exit: {
        opacity: 0,
        x: -20,
        transition: { duration: 0.2 }
    }
}

/** 淡入淡出页面过渡 */
export const fadePageTransition = {
    initial: { opacity: 0 },
    animate: {
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 35
        }
    },
    exit: {
        opacity: 0,
        transition: { duration: 0.15 }
    }
}

/* ========================================
   特殊效果
   ======================================== */

/** 悬浮动画 (无限循环) */
export const floatingAnimation = {
    y: [0, -8, 0],
    transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
    }
}

/** 脉冲动画 */
export const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
    }
}

/** 微光闪烁 */
export const shimmerAnimation = {
    opacity: [0.5, 1, 0.5],
    transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
    }
}

/* ========================================
   视口触发配置
   ======================================== */

/** 标准视口配置 */
export const viewportConfig = {
    once: true,
    margin: "-100px"
}

/** 提前触发 */
export const viewportEarly = {
    once: true,
    margin: "-50px"
}

/** 延迟触发 */
export const viewportLate = {
    once: true,
    margin: "-200px"
}

/* ========================================
   工具函数
   ======================================== */

/** 创建自定义 delay 的 fadeInUp */
export const fadeInUpWithDelay = (delay = 0) => ({
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 30,
            delay
        }
    }
})

/** 创建自定义 stagger 容器 */
export const createStaggerContainer = (staggerChildren = 0.06, delayChildren = 0.1) => ({
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren,
            delayChildren
        }
    }
})
