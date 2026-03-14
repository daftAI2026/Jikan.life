/**
 * [INPUT]: 依赖 remotion/registerRoot 与 ./Root.jsx
 * [OUTPUT]: 无（Remotion Studio 入口注册）
 * [POS]: remotion/ 模块入口，供 CLI 发现组合树
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { registerRoot } from "remotion"
import { RemotionRoot } from "./Root.jsx"

registerRoot(RemotionRoot)
