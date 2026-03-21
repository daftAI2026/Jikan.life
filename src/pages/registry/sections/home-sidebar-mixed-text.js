/**
 * [INPUT]: 无外部依赖（纯字符串分段规则）
 * [OUTPUT]: 对外提供 splitSidebarMixedTextRuns
 * [POS]: registry/sections 的 sidebar 文本分段 helper，仅服务 HomeSidebar Year 卡的日文混排字体收口
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

function isAsciiRunChar(char) {
    return char.codePointAt(0) <= 0x7f
}

function splitSidebarMixedTextRuns(text, lang) {
    if (typeof text !== "string" || text.length === 0) return []
    if (lang !== "ja") return [{ kind: "latin", text }]

    const runs = []

    for (const char of text) {
        const kind = isAsciiRunChar(char) ? "latin" : "ja"
        const lastRun = runs[runs.length - 1]

        if (lastRun?.kind === kind) {
            lastRun.text += char
            continue
        }

        runs.push({ kind, text: char })
    }

    return runs
}

export { splitSidebarMixedTextRuns }
