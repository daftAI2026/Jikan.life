/**
 * [INPUT]: 依赖原生 JS 数组与字符串处理
 * [OUTPUT]: 对外提供 matchSorter 兼容函数与 rankings 常量
 * [POS]: lib 层第三方依赖替身，满足 vendor SearchDialog 最小能力
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const rankings = {
  CONTAINS: 1,
}

const normalize = (value) => String(value ?? "").toLowerCase()

const readKeyValue = (item, keySpec) => {
  const key = typeof keySpec === "string" ? keySpec : keySpec?.key
  if (!key) {
    return ""
  }
  return item?.[key]
}

function matchSorter(items, query, options = {}) {
  const source = Array.isArray(items) ? items : []
  const q = normalize(query).trim()

  if (!q) {
    return source.slice()
  }

  const keys = Array.isArray(options.keys) ? options.keys : []

  const scored = source
    .map((item, index) => {
      const fields = keys.length > 0 ? keys.map((key) => readKeyValue(item, key)) : [item]
      const values = fields.map(normalize)

      let bestScore = -1
      for (const value of values) {
        if (!value) {
          continue
        }
        if (value === q) {
          bestScore = Math.max(bestScore, 3)
          continue
        }
        if (value.startsWith(q)) {
          bestScore = Math.max(bestScore, 2)
          continue
        }
        if (value.includes(q)) {
          bestScore = Math.max(bestScore, 1)
        }
      }

      return { item, score: bestScore, index }
    })
    .filter((entry) => entry.score >= rankings.CONTAINS)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score
      }
      return a.index - b.index
    })

  return scored.map((entry) => entry.item)
}

matchSorter.rankings = rankings

export { matchSorter, rankings }
export default matchSorter
