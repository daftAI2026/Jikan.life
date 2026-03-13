/**
 * [INPUT]: 无
 * [OUTPUT]: 导出 SOCIAL_LINKS 社交入口配置
 * [POS]: data 的社交链接配置，被 LandingFooter 消费
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const SOCIAL_LINKS = [
    {
        id: "github",
        label: "GitHub",
        href: "https://github.com/daftAI2026/Jikan.life",
        className: "size-5",
    },
    {
        id: "xiaohongshu",
        label: "Xiaohongshu",
        href: "https://www.xiaohongshu.com/user/profile/5f4696c800000000010011f6",
        className: "size-9",
    },
]

export { SOCIAL_LINKS }
