/**
 * [INPUT]: 依赖 react(useLayoutEffect/useRef/useState)、md-bottom-tabs-widths，以及调用方透传的 tabsContainerRef/measureTriggerRefs/measureLabels
 * [OUTPUT]: 对外提供 useMdBottomTabsMetrics 私有 hook，输出 distributedTabWidths 与 indicatorClassName
 * [POS]: registry/sections/workspace 的 md bottom-tabs 测量链收口层，统一首帧同步测量、tablist-only resize 观察、字体补测与 live-resize indicator 策略
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { useLayoutEffect, useRef, useState } from "react"
import { resolveMdBottomTabWidths } from "./md-bottom-tabs-widths"

function areTabWidthsEqual(left, right) {
    if (left.length !== right.length) return false
    return left.every((width, index) => Math.abs(width - right[index]) < 0.5)
}

export function useMdBottomTabsMetrics({ tabsContainerRef, measureTriggerRefs, measureLabels }) {
    const [distributedTabWidths, setDistributedTabWidths] = useState([])
    const [isResizingTabs, setIsResizingTabs] = useState(false)
    const naturalTabWidthsRef = useRef([])
    const lastTablistWidthRef = useRef(null)
    const resizeSettledTimeoutRef = useRef(null)
    const measureLabelsKey = measureLabels.join("|")

    useLayoutEffect(() => {
        window.clearTimeout(resizeSettledTimeoutRef.current)
        resizeSettledTimeoutRef.current = null

        if (measureLabels.length === 0) {
            naturalTabWidthsRef.current = []
            lastTablistWidthRef.current = null
            setDistributedTabWidths([])
            setIsResizingTabs(false)
            return undefined
        }

        const containerElement = tabsContainerRef.current
        if (!containerElement) return undefined

        const tabsListElement = containerElement.querySelector('[role="tablist"]')
        if (!tabsListElement) return undefined

        let cancelled = false
        let resizeObserver = null

        const commitDistributedWidths = (tablistWidth) => {
            if (!Number.isFinite(tablistWidth) || tablistWidth <= 0) return
            lastTablistWidthRef.current = tablistWidth
            setDistributedTabWidths((previousWidths) => {
                const nextWidths = resolveMdBottomTabWidths({
                    naturalWidths: naturalTabWidthsRef.current,
                    containerWidth: tablistWidth,
                })
                return areTabWidthsEqual(previousWidths, nextWidths) ? previousWidths : nextWidths
            })
        }

        const remeasureNaturalWidths = () => {
            if (cancelled) return
            const naturalWidths = measureTriggerRefs.current
                .slice(0, measureLabels.length)
                .map((element) => element?.getBoundingClientRect().width ?? 0)
            naturalTabWidthsRef.current = naturalWidths
            const tablistWidth = tabsListElement.getBoundingClientRect().width
            if (!Number.isFinite(tablistWidth) || tablistWidth <= 0) return
            setDistributedTabWidths(resolveMdBottomTabWidths({
                naturalWidths: naturalTabWidthsRef.current,
                containerWidth: tablistWidth,
            }))
            lastTablistWidthRef.current = tablistWidth
        }

        setIsResizingTabs(false)
        remeasureNaturalWidths()

        if (typeof document !== "undefined" && document.fonts && document.fonts.status !== "loaded") {
            document.fonts.ready.then(() => {
                if (cancelled) return
                remeasureNaturalWidths()
            })
        }

        if (typeof ResizeObserver === "function") {
            resizeObserver = new ResizeObserver(() => {
                const nextWidth = tabsListElement.getBoundingClientRect().width
                if (!Number.isFinite(nextWidth) || nextWidth <= 0) return
                if (lastTablistWidthRef.current !== null && Math.abs(nextWidth - lastTablistWidthRef.current) <= 1) return

                setIsResizingTabs(true)
                commitDistributedWidths(nextWidth)
                window.clearTimeout(resizeSettledTimeoutRef.current)
                resizeSettledTimeoutRef.current = window.setTimeout(() => {
                    if (cancelled) return
                    setIsResizingTabs(false)
                    resizeSettledTimeoutRef.current = null
                }, 120)
            })
            resizeObserver.observe(tabsListElement)
        }

        return () => {
            cancelled = true
            window.clearTimeout(resizeSettledTimeoutRef.current)
            resizeSettledTimeoutRef.current = null
            resizeObserver?.disconnect()
        }
    }, [measureLabelsKey, measureLabels.length, measureTriggerRefs, tabsContainerRef])

    const indicatorClassName = distributedTabWidths.length !== measureLabels.length
        ? "!opacity-0 !transition-none"
        : isResizingTabs ? "!transition-none" : undefined

    return {
        distributedTabWidths,
        indicatorClassName,
    }
}
