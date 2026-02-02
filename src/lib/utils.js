/**
 * [INPUT]: 依赖 clsx, tailwind-merge
 * [OUTPUT]: 对外提供 cn() 工具函数
 * [POS]: lib/ 通用工具库，用于合并 Tailwind CSS 类名
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
