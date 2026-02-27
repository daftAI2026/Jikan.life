/**
 * [INPUT]: 依赖 react(useEffect/useMemo/useState), react-aria-components(parseColor)
 * [OUTPUT]: 对外提供 useColorPickerStateBridge(value) Hook（桥接外部 hex 与内部 Color 对象状态）
 * [POS]: components/ui ColorPicker 的状态同步桥，隔离受控值回流与拖拽语义
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { useEffect, useMemo, useState } from "react"
import { parseColor } from "react-aria-components"

export function useColorPickerStateBridge(value) {
    const externalColor = useMemo(() => {
        try {
            return parseColor(value ?? "#000000")
        } catch {
            return parseColor("#000000")
        }
    }, [value])
    const externalHex = useMemo(() => externalColor.toString('hex'), [externalColor])

    const [internalColor, setInternalColor] = useState(externalColor)

    useEffect(() => {
        setInternalColor((prev) => (
            prev.toString('hex') === externalHex ? prev : externalColor
        ))
    }, [externalColor, externalHex])

    return {
        internalColor,
        setInternalColor,
    }
}
