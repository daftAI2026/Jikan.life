/**
 * [INPUT]: 依赖 ./vendor-styling.js 的 class merge 运行时；来源 commit `72433e38914eee652c65506c6165582450f0a1d7`
 * [OUTPUT]: 对外提供 vendored `cn` 与稳定随机 id 辅助
 * [POS]: components/ui/vendor/kumo-date-picker 的轻量样式工具快照，为 DatePicker 运行时补足唯一外部 chunk
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * 删除条件: 当 npm `@cloudflare/kumo` 正式版本包含 `rangeSelectionBehavior` 与 `onRangeComplete` 后删除整个目录
 */
"use client";
import { t as r, c as s } from "./vendor-styling.js";
function a(...e) {
  return r(s(e));
}
const c = (e) => e.toString(16).padStart(2, "0");
function l() {
  const t = (typeof globalThis < "u" ? globalThis : {}).crypto;
  if (t && typeof t.randomUUID == "function")
    return t.randomUUID();
  if (t && typeof t.getRandomValues == "function") {
    const n = new Uint8Array(16);
    t.getRandomValues(n), n[6] = n[6] & 15 | 64, n[8] = n[8] & 63 | 128;
    const o = Array.from(n, c).join("");
    return `${o.slice(0, 8)}-${o.slice(8, 12)}-${o.slice(
      12,
      16
    )}-${o.slice(16, 20)}-${o.slice(20)}`;
  }
  return `r${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}
export {
  a as c,
  l as s
};
