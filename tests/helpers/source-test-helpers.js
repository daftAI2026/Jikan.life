/**
 * [INPUT]: 依赖 node:assert/strict, node:fs, node:path, node:url
 * [OUTPUT]: 对外提供 readSource/readJson/listFiles/assertNamedImports/pathToFileURL 测试辅助
 * [POS]: tests/helpers 的源码断言工具层，供行为护栏测试复用
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import { pathToFileURL } from "node:url"

function readSource(relativePath) {
    const filePath = path.join(process.cwd(), relativePath)
    return fs.readFileSync(filePath, "utf8")
}

function readJson(relativePath) {
    const filePath = path.join(process.cwd(), relativePath)
    return JSON.parse(fs.readFileSync(filePath, "utf8"))
}

function listFiles(relativePath) {
    const root = path.join(process.cwd(), relativePath)
    const entries = fs.readdirSync(root, { withFileTypes: true })
    return entries.flatMap((entry) => {
        const nextPath = path.join(relativePath, entry.name)
        if (entry.isDirectory()) return listFiles(nextPath)
        return [nextPath]
    })
}

function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function findImportStatement(source, moduleSpecifier) {
    const pattern = new RegExp(
        `(?:^|\\n)\\s*import\\s+(?:type\\s+)?(?:[^,{]+,\\s*)?\\{[^}]*\\}\\s+from\\s+["']${escapeRegExp(moduleSpecifier)}["']`,
        "m"
    )
    const match = source.match(pattern)
    assert.ok(match, `Expected named import from "${moduleSpecifier}"`)
    return match[0].trim()
}

function parseNamedSpecifiers(importStatement) {
    const start = importStatement.indexOf("{")
    const end = importStatement.indexOf("}", start + 1)
    if (start < 0 || end < 0) return []
    return importStatement
        .slice(start + 1, end)
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
}

function assertNamedImports(source, moduleSpecifier, expectedSpecifiers) {
    const importStatement = findImportStatement(source, moduleSpecifier)
    const actualSpecifiers = new Set(parseNamedSpecifiers(importStatement))
    expectedSpecifiers.forEach((specifier) => {
        assert.ok(
            actualSpecifiers.has(specifier),
            `Expected "${specifier}" to be imported from "${moduleSpecifier}"`
        )
    })
}

export { assertNamedImports, fs, listFiles, path, pathToFileURL, readJson, readSource }
