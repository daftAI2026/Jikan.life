/**
 * [INPUT]: 依赖 @radix-ui/react-collapsible
 * [OUTPUT]: 对外提供 Collapsible 相关组件
 * [POS]: ui/ 可折叠内容组件
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

function Collapsible({
  ...props
}) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />;
}

function CollapsibleTrigger({
  ...props
}) {
  return (<CollapsiblePrimitive.CollapsibleTrigger data-slot="collapsible-trigger" {...props} />);
}

function CollapsibleContent({
  ...props
}) {
  return (<CollapsiblePrimitive.CollapsibleContent data-slot="collapsible-content" {...props} />);
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
