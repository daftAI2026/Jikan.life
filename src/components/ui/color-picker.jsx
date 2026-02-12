/**
 * [INPUT]: 依赖 @/components/ui/color, react-aria-components, @/components/ui/popover(Kumo), @/components/ui/select(Kumo), @/components/ui/button, @phosphor-icons/react
 * [OUTPUT]: ColorPicker 组件与 useColorPickerStateBridge 同步桥（保持对外 hex 协议，内部维持 Color 对象语义）
 * [POS]: UI组件层 - 统一颜色编辑入口，被 Landing 与 Registry 共用，负责外部受控值与内部拖拽状态一致性
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover } from "@/components/ui/popover"
import { Select } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Eyedropper } from "@phosphor-icons/react"
import { useState, useMemo, useContext, useEffect } from "react"
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
            className="h-8 w-8 shrink-0 rounded-xl"
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
   Color State Bridge Hook
   说明：桥接外部 hex 受控值与内部 Color 对象，避免触底黑色回流抹掉 HSB 通道语义
   ======================================================================== */
function useColorPickerStateBridge(value) {
    const externalColor = useMemo(() => {
        try {
            return parseColor(value ?? "#000000")
        } catch {
            return parseColor("#000000")
        }
    }, [value])

    const [internalColor, setInternalColor] = useState(externalColor)

    useEffect(() => {
        if (externalColor.toString('hex') !== internalColor.toString('hex')) {
            setInternalColor(externalColor)
        }
    }, [externalColor, internalColor])

    return {
        internalColor,
        setInternalColor,
    }
}

/* ========================================================================
   ColorPicker Component
   ======================================================================== */
export function ColorPicker({ value, onChange, className, disabled }) {
    const { internalColor, setInternalColor } = useColorPickerStateBridge(value)

    const [colorSpace, setColorSpace] = useState("hex")

    const handleColorChange = (newColor) => {
        setInternalColor(newColor)
        if (onChange) {
            onChange(newColor.toString('hex'))
        }
    }

    return (
        <JollyColorPicker value={internalColor} onChange={handleColorChange}>
            <Popover>
                <Popover.Trigger asChild>
                    <Button
                        variant="outline"
                        disabled={disabled}
                        className={cn(
                            "w-full justify-start text-left font-normal rounded-xl px-2",
                            className
                        )}
                    >
                        <div className="w-full flex items-center gap-2">
                            <ColorSwatch
                                color={internalColor}
                                className="size-6 rounded-md border border-border shrink-0"
                            />
                            <span className="truncate font-mono text-sm uppercase text-muted-foreground">
                                {internalColor.toString('hex')}
                            </span>
                        </div>
                    </Button>
                </Popover.Trigger>
                <Popover.Content className="w-64 rounded-xl p-3" sideOffset={8}>
                    <div className="flex flex-col gap-3">
                            {/* 1. Color Area (HSB) */}
                            <ColorArea
                                colorSpace="hsb"
                                xChannel="saturation"
                                yChannel="brightness"
                                className="h-40 w-full shrink-0"
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
                            <div className="flex items-center gap-2">
                                <EyeDropperButton />

                                <Select
                                    value={colorSpace}
                                    onValueChange={setColorSpace}
                                    className="h-8 flex-1 rounded-xl text-xs font-medium uppercase"
                                >
                                    <Select.Option value="hex">HEX</Select.Option>
                                    <Select.Option value="rgb">RGB</Select.Option>
                                    <Select.Option value="hsl">HSL</Select.Option>
                                    <Select.Option value="hsb">HSB</Select.Option>
                                </Select>
                            </div>

                            {/* 4. Inputs */}
                            <div className="flex gap-2">
                                {colorSpace === "hex" && (
                                    <Input
                                        value={internalColor.toString('hex')}
                                        onChange={(e) => {
                                            try {
                                                handleColorChange(parseColor(e.target.value))
                                            } catch { }
                                        }}
                                        maxLength={7}
                                        className="h-8 font-mono text-xs uppercase text-center rounded-xl"
                                        placeholder="HEX"
                                    />
                                )}

                                {colorSpace === "rgb" && (
                                    <>
                                        {['red', 'green', 'blue'].map(channel => (
                                            <ColorField key={channel} colorSpace="rgb" channel={channel} className="flex-1">
                                                <AriaInput
                                                    className="flex h-8 w-full rounded-xl border border-input bg-background px-2 py-1 text-center text-xs font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                    placeholder={channel[0].toUpperCase()}
                                                />
                                            </ColorField>
                                        ))}
                                    </>
                                )}

                                {colorSpace === "hsl" && (
                                    <>
                                        {['hue', 'saturation', 'lightness'].map(channel => (
                                            <ColorField key={channel} colorSpace="hsl" channel={channel} className="flex-1">
                                                <AriaInput
                                                    className="flex h-8 w-full rounded-xl border border-input bg-background px-2 py-1 text-center text-xs font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                    placeholder={channel[0].toUpperCase()}
                                                />
                                            </ColorField>
                                        ))}
                                    </>
                                )}

                                {colorSpace === "hsb" && (
                                    <>
                                        {['hue', 'saturation', 'brightness'].map(channel => (
                                            <ColorField key={channel} colorSpace="hsb" channel={channel} className="flex-1">
                                                <AriaInput
                                                    className="flex h-8 w-full rounded-xl border border-input bg-background px-2 py-1 text-center text-xs font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                    placeholder={channel[0].toUpperCase()}
                                                />
                                            </ColorField>
                                        ))}
                                    </>
                                )}
                            </div>
                        </div>
                </Popover.Content>
            </Popover>
        </JollyColorPicker>
    )
}
