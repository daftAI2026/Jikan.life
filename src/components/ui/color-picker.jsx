/**
 * [INPUT]: 依赖 @/components/ui/color, @/components/ui/use-color-picker-state-bridge, react-aria-components, @/components/ui/popover(Kumo), @/components/ui/select(Kumo), @/components/ui/button, @phosphor-icons/react
 * [OUTPUT]: ColorPicker 组件（保持对外 hex 协议，内部通过状态桥 Hook 维持 Color 对象语义，通道输入使用配置映射渲染）
 * [POS]: UI组件层 - 统一颜色编辑入口，被 Landing 与 Registry 共用；采用 KUMO token 样式、`aspect-square` 色域和工具栏比例布局
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover } from "@/components/ui/popover"
import { Select } from "@/components/ui/select"
import { useColorPickerStateBridge } from "@/components/ui/use-color-picker-state-bridge"
import { cn } from "@/lib/utils"
import { Eyedropper } from "@phosphor-icons/react"
import { useState, useContext } from "react"
import {
    ColorArea,
    ColorField,
    ColorPicker as JollyColorPicker,
    ColorSlider,
    ColorSwatch,
    ColorThumb,
    SliderTrack,
} from "@/components/ui/color"
import {
    ColorPickerStateContext,
    Input as AriaInput,
    parseColor,
} from "react-aria-components"

const COLOR_CHANNEL_INPUT_CLASS =
    "flex h-9 w-full rounded-lg bg-kumo-control px-2 py-1 text-center text-xs font-mono text-kumo-default ring ring-kumo-line placeholder:text-kumo-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kumo-ring disabled:cursor-not-allowed disabled:opacity-50"

const COLOR_SPACE_CHANNELS = {
    rgb: ["red", "green", "blue"],
    hsl: ["hue", "saturation", "lightness"],
    hsb: ["hue", "saturation", "brightness"],
}

/* ========================================================================
   EyeDropper Button
   ======================================================================== */
function EyeDropperButton() {
    const state = useContext(ColorPickerStateContext) // JollyUI uses context

    // Check browser support
    if (typeof window === "undefined" || !("EyeDropper" in window)) {
        return null
    }

    return (
        <Button
            variant="outline"
            size="icon"
            shape="square"
            className="h-9 w-9 shrink-0"
            onClick={() => {
                // @ts-expect-error
                new window.EyeDropper()
                    .open()
                    .then((result) => state.setColor(parseColor(result.sRGBHex)))
                    .catch(() => { })
            }}
            title="Pick a color from screen"
        >
            <Eyedropper className="h-4 w-4" weight="bold" />
        </Button>
    )
}

/* ========================================================================
   ColorPicker Component
   ======================================================================== */
export function ColorPicker({ value, onChange, className, disabled }) {
    const { internalColor, setInternalColor } = useColorPickerStateBridge(value)

    const [colorSpace, setColorSpace] = useState("hex")
    const channels = COLOR_SPACE_CHANNELS[colorSpace] ?? null

    const handleColorChange = (newColor) => {
        setInternalColor(newColor)
        if (onChange) {
            onChange(newColor.toString('hex'))
        }
    }

    const renderChannelInputs = (space, channels) => (
        <>
            {channels.map((channel) => (
                <ColorField key={channel} colorSpace={space} channel={channel} className="flex-1">
                    <AriaInput
                        className={COLOR_CHANNEL_INPUT_CLASS}
                        placeholder={channel[0].toUpperCase()}
                    />
                </ColorField>
            ))}
        </>
    )

    return (
        <JollyColorPicker value={internalColor} onChange={handleColorChange}>
            <Popover>
                <Popover.Trigger asChild>
                    <Button
                        variant="outline"
                        disabled={disabled}
                        className={cn(
                            "w-full justify-start rounded-lg px-2 text-left font-normal",
                            className
                        )}
                    >
                        <div className="w-full flex items-center gap-2">
                            <ColorSwatch
                                color={internalColor}
                                className="size-6 shrink-0 rounded-md ring ring-kumo-line"
                            />
                            <span className="truncate font-mono text-sm uppercase text-kumo-subtle">
                                {internalColor.toString('hex')}
                            </span>
                        </div>
                    </Button>
                </Popover.Trigger>
                <Popover.Content className="w-64 p-3" sideOffset={8}>
                    <div className="flex flex-col gap-3">
                            {/* 1. Color Area (HSB) */}
                            <ColorArea
                                colorSpace="hsb"
                                xChannel="saturation"
                                yChannel="brightness"
                                className="w-full aspect-square shrink-0"
                            >
                                <ColorThumb />
                            </ColorArea>

                            {/* 2. Hue Slider */}
                            <ColorSlider channel="hue" colorSpace="hsb" className="mt-1 w-full">
                                <SliderTrack className="h-3 w-full rounded-full">
                                    <ColorThumb className="top-1/2" />
                                </SliderTrack>
                            </ColorSlider>

                            {/* 3. Toolbar: EyeDropper + ColorSpace Select */}
                            <div className="flex min-w-0 items-center gap-2">
                                <EyeDropperButton />

                                <Select
                                    value={colorSpace}
                                    onValueChange={setColorSpace}
                                    className="h-9 w-[72px] shrink-0 rounded-lg text-sm font-medium uppercase"
                                >
                                    <Select.Option value="hex">HEX</Select.Option>
                                    <Select.Option value="rgb">RGB</Select.Option>
                                    <Select.Option value="hsl">HSL</Select.Option>
                                    <Select.Option value="hsb">HSB</Select.Option>
                                </Select>

                                {colorSpace === "hex" && (
                                    <Input
                                        value={internalColor.toString('hex')}
                                        onChange={(e) => {
                                            try {
                                                handleColorChange(parseColor(e.target.value))
                                            } catch { }
                                        }}
                                        maxLength={7}
                                        className="h-9 min-w-0 w-0 flex-1 rounded-lg text-center font-mono text-sm uppercase"
                                        placeholder="HEX"
                                    />
                                )}
                            </div>

                            {/* 4. Inputs */}
                            {channels && (
                                <div className="flex gap-2">
                                    {renderChannelInputs(colorSpace, channels)}
                                </div>
                            )}
                        </div>
                </Popover.Content>
            </Popover>
        </JollyColorPicker>
    )
}
