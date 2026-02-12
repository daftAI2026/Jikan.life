/**
 * [INPUT]: 依赖 react-aria-components
 * [OUTPUT]: 对外提供 Color 相关原子组件 (ColorWheel, ColorArea, SliderTrack, ColorThumb 等)
 * [POS]: ui/ 颜色选择器底层原语，约束手柄可视性与可拖拽行为
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import {
  ColorArea as AriaColorArea,
  ColorField as AriaColorField,
  ColorPicker as AriaColorPicker,
  ColorSlider as AriaColorSlider,
  ColorSwatch as AriaColorSwatch,
  ColorSwatchPicker as AriaColorSwatchPicker,
  ColorSwatchPickerItem as AriaColorSwatchPickerItem,
  ColorThumb as AriaColorThumb,
  ColorWheel as AriaColorWheel,
  ColorWheelTrack as AriaColorWheelTrack,
  SliderOutput as AriaSliderOutput,
  SliderTrack as AriaSliderTrack,
  composeRenderProps,
} from "react-aria-components";

import { cn } from "@/lib/utils"

const ColorSlider = AriaColorSlider

const ColorField = AriaColorField

const ColorWheelTrack = AriaColorWheelTrack

const ColorPicker = AriaColorPicker

const SliderOutput = AriaSliderOutput

function ColorWheel({
  className,
  outerRadius = 100,
  innerRadius = 74,
  ...props
}) {
  return (
    <AriaColorWheel
      innerRadius={innerRadius}
      outerRadius={outerRadius}
      className={composeRenderProps(className, (className) => cn(className))}
      {...props} />
  );
}

function ColorArea({
  className,
  ...props
}) {
  return (
    <AriaColorArea
      className={composeRenderProps(className, (className) =>
        cn(
          "size-[192px] shrink-0 rounded-md ring-1 ring-kumo-fill shadow-sm",
          className
        ))}
      {...props} />
  );
}

function SliderTrack({
  className,
  ...props
}) {
  return (
    <AriaSliderTrack
      className={composeRenderProps(className, (className) =>
        cn("h-7 w-[192px] rounded-md ring-1 ring-kumo-fill", className))}
      {...props} />
  );
}

function ColorThumb({
  className,
  ...props
}) {
  return (
    <AriaColorThumb
      className={composeRenderProps(className, (className) =>
        cn(
          "z-20 box-border size-5 rounded-[50%] border-2 border-foreground shadow-md",
          /* Focus Visible */
          "data-[focus-visible]:size-6",
          className
        ))}
      {...props} />
  );
}

function ColorSwatchPicker({
  className,
  ...props
}) {
  return (
    <AriaColorSwatchPicker
      className={composeRenderProps(className, (className) =>
        cn("flex flex-wrap gap-2", className))}
      {...props} />
  );
}

function ColorSwatchPickerItem({
  className,
  ...props
}) {
  return (
    <AriaColorSwatchPickerItem
      className={composeRenderProps(className, (className) =>
        cn(
          "size-8 overflow-hidden rounded-md border-2 ring-offset-background transition-colors",
          /* Selected */
          "data-[selected]:border-foreground",
          /* Disabled */
          "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          /* Focus Visible */
          "data-[focus-visible]:outline-none data-[focus-visible]:ring-2 data-[focus-visible]:ring-ring",
          className
        ))}
      {...props} />
  );
}

function ColorSwatch({
  className,
  ...props
}) {
  return (
    <AriaColorSwatch
      className={composeRenderProps(className, (className) =>
        cn("size-8", className))}
      {...props} />
  );
}

export {
  ColorSlider,
  ColorField,
  ColorWheelTrack,
  ColorWheel,
  ColorPicker,
  ColorArea,
  SliderTrack,
  SliderOutput,
  ColorThumb,
  ColorSwatchPicker,
  ColorSwatchPickerItem,
  ColorSwatch,
}
