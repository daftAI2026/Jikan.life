/**
 * [INPUT]: 依赖布局阈值常量与侧栏开关状态（sidebarOpen）
 * [OUTPUT]: 对外提供真实 tier 判定与桌面壳启用判定 helper（含 LG_MIN/MD_MIN/SIDEBAR_MID_MAX）
 * [POS]: pages/registry 的布局判定单一真相源，负责真实 viewport tier 与工作区桌面壳启用规则，供 HomePage/HomeGrid/测试共享
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const MD_MIN = 768
const LG_MIN = 1024
const SIDEBAR_MID_MAX = 1314

function resolveEffectiveLayoutTier({ viewportWidth, sidebarOpen }) {
    if (viewportWidth < MD_MIN) return "mobile"
    if (viewportWidth < LG_MIN) return "md"
    if (sidebarOpen && viewportWidth <= SIDEBAR_MID_MAX) return "mid"
    return "lg"
}

function shouldUseDesktopWorkspaceShell({ effectiveLayoutTier, sidebarOpen }) {
    if (effectiveLayoutTier === "lg" || effectiveLayoutTier === "mid") return true
    if (effectiveLayoutTier === "md") return !sidebarOpen
    return false
}

export { LG_MIN, MD_MIN, SIDEBAR_MID_MAX, resolveEffectiveLayoutTier, shouldUseDesktopWorkspaceShell }
