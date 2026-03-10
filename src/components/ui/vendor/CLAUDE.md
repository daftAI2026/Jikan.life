# vendor/
> L2 | 父级: /src/components/ui/CLAUDE.md

成员清单
kumo-date-picker/: 临时 vendored 的 Kumo DatePicker runtime 快照，冻结上游 `rangeSelectionBehavior/onRangeComplete` 能力并阻断 hash chunk 向页面层扩散

架构决策
`vendor/` 不是通用第三方镜像仓，而是 UI 适配层里的临时桥接区。只有在 npm 包尚未发布、页面层又必须尽快消费某个上游行为时，才允许把最小运行时闭包冻结到这里，并明确删除条件，避免“临时桥接”腐化成常驻分叉。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
