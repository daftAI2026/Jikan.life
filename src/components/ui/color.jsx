/**
 * [INPUT]: 依赖 react-aria-components
 * [OUTPUT]: 对外提供 Color 相关原子组件 (ColorWheel, ColorArea, SliderTrack, ColorThumb 等)，其中 ColorThumb 采用外圈+中心点分层样式常量
 * [POS]: ui/ 颜色选择器底层原语，统一圆角/描边/手柄可视性，作为颜色面板视觉样式单一来源并降低边缘混色风险
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

const COLOR_THUMB_BASE_CLASS =
  "z-20 box-border size-5 rounded-[50%] overflow-hidden shadow-md"

const COLOR_THUMB_OUTER_RING_CLASS =
  "before:pointer-events-none before:absolute before:inset-0 before:rounded-[50%] before:bg-[var(--color-white)] before:content-['']"

const COLOR_THUMB_CENTER_DOT_CLASS =
  "after:pointer-events-none after:absolute after:top-1/2 after:left-1/2 after:size-2 after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-[50%] after:bg-[inherit] after:content-['']"

const COLOR_THUMB_FOCUS_CLASS =
  "data-[focus-visible]:size-6 data-[focus-visible]:outline-none data-[focus-visible]:ring-2 data-[focus-visible]:ring-kumo-hairline"

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
          "size-[192px] shrink-0 rounded-lg ring-1 ring-kumo-line shadow-sm",
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
        cn("h-7 w-[192px] rounded-lg ring-1 ring-kumo-line", className))}
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
          COLOR_THUMB_BASE_CLASS,
          COLOR_THUMB_OUTER_RING_CLASS,
          COLOR_THUMB_CENTER_DOT_CLASS,
          COLOR_THUMB_FOCUS_CLASS,
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
          "size-8 overflow-hidden rounded-md border-2 transition-colors",
          /* Selected */
          "data-[selected]:border-kumo-default",
          /* Disabled */
          "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          /* Focus Visible */
          "data-[focus-visible]:outline-none data-[focus-visible]:ring-2 data-[focus-visible]:ring-kumo-hairline",
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
