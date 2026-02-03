/**
 * [INPUT]: 依赖 @/components/ui/color, react-aria-components, @/components/ui/popover, @/components/ui/select, @/components/ui/button, lucide-react
 * [OUTPUT]: 完整 JollyUI 风格 ColorPicker (EyeDropper + Multi-ColorSpace)
 * [POS]: UI组件层
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Popover,
    PopoverDialog,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Pipette } from "lucide-react"
import { useState, useMemo, useContext } from "react"
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
    Label as AriaLabel,
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
            <Pipette className="h-4 w-4" />
        </Button>
    )
}

/* ========================================================================
   ColorPicker Component
   ======================================================================== */
export function ColorPicker({ value, onChange, className, disabled }) {
    // Safe parser
    const colorObject = useMemo(() => {
        try {
            return parseColor(value ?? "#000000")
        } catch {
            return parseColor("#000000")
        }
    }, [value])

    const [colorSpace, setColorSpace] = useState("hex")

    // Handle color change from Aria component
    const handleColorChange = (newColor) => {
        if (onChange) {
            onChange(newColor.toString('hex'))
        }
    }

    return (
        <JollyColorPicker value={colorObject} onChange={handleColorChange}>
            <PopoverTrigger>
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
                            color={colorObject}
                            className="size-6 rounded-md border border-border shrink-0"
                        />
                        <span className="truncate font-mono text-sm uppercase text-muted-foreground">
                            {colorObject.toString('hex')}
                        </span>
                    </div>
                </Button>
                <Popover>
                    <PopoverDialog className="w-64 p-3 rounded-xl">
                        <div className="flex flex-col gap-3">
                            {/* 1. Color Area (HSB) */}
                            <ColorArea
                                colorSpace="hsb"
                                xChannel="saturation"
                                yChannel="brightness"
                                className="h-40 w-full rounded-md border border-border shrink-0"
                            >
                                <ColorThumb className="z-20" />
                            </ColorArea>

                            {/* 2. Hue Slider */}
                            <ColorSlider channel="hue" colorSpace="hsb" className="w-full">
                                <SliderTrack className="h-3 w-full rounded-full border border-border">
                                    <ColorThumb className="top-1/2" />
                                </SliderTrack>
                            </ColorSlider>

                            {/* 3. Toolbar: EyeDropper + ColorSpace Select */}
                            <div className="flex items-center gap-2">
                                <EyeDropperButton />

                                <Select value={colorSpace} onValueChange={setColorSpace}>
                                    <SelectTrigger className="h-8 flex-1 rounded-xl text-xs font-medium uppercase">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent position="popper" className="rounded-xl">
                                        <SelectItem value="hex" className="text-xs">HEX</SelectItem>
                                        <SelectItem value="rgb" className="text-xs">RGB</SelectItem>
                                        <SelectItem value="hsl" className="text-xs">HSL</SelectItem>
                                        <SelectItem value="hsb" className="text-xs">HSB</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* 4. Inputs */}
                            <div className="flex gap-2">
                                {colorSpace === "hex" && (
                                    <Input
                                        value={colorObject.toString('hex')}
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
                    </PopoverDialog>
                </Popover>
            </PopoverTrigger>
        </JollyColorPicker>
    )
}
