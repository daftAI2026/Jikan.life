/**
 * [INPUT]: 依赖 ./date-picker-runtime.js 的 vendored DatePicker 运行时；来源 commit `72433e38914eee652c65506c6165582450f0a1d7`
 * [OUTPUT]: 对外提供 vendored `DatePicker` 组件入口，供 `@/components/ui/kumo` 单点接管 range restart 能力
 * [POS]: components/ui/vendor/kumo-date-picker 的稳定导出面，冻结上游 DatePicker dist 闭包并隔离 hash 文件名
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * 删除条件: 当 npm `@cloudflare/kumo` 正式版本包含 `rangeSelectionBehavior` 与 `onRangeComplete` 后删除整个目录
 */
"use client";
import { D as t } from "./date-picker-runtime.js";
export {
  t as DatePicker
};
