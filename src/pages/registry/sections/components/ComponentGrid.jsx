/**
 * [INPUT]: 依赖 react, @cloudflare/kumo 组件, @phosphor-icons/react, ComponentCell/ComponentData
 * [OUTPUT]: 对外提供 ComponentGrid 组件
 * [POS]: registry/sections/components 的主网格，复刻 Kumo 组件墙
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { useMemo, useState } from "react"
import {
    Button,
    Checkbox,
    Collapsible,
    Combobox,
    Dialog,
    DropdownMenu,
    Input,
    LayerCard,
    Select,
    Switch,
    Tooltip,
    TooltipProvider,
} from "@cloudflare/kumo"
import { ArrowRight, Plus, TextB, X } from "@phosphor-icons/react"
import { ComponentCell } from "./ComponentCell"
import { COMPONENT_GRID_ITEMS } from "./ComponentData"

function ComponentGrid() {
    const [switchChecked, setSwitchChecked] = useState(true)
    const [checkboxChecked, setCheckboxChecked] = useState(true)
    const [selectValue, setSelectValue] = useState("v1.0.0")
    const [comboboxValue, setComboboxValue] = useState(null)
    const [collapsibleOpen, setCollapsibleOpen] = useState(true)
    const [email, setEmail] = useState("name@example.com")

    const issues = useMemo(
        () => ["Runtime error", "Style bug", "Docs update"],
        []
    )

    const emailError = email && !email.includes("@") ? "Invalid!" : undefined

    const renderers = {
        button: (
            <div className="flex flex-col gap-2">
                <Button variant="secondary" icon={Plus}>
                    Create Worker
                </Button>
                <Button variant="primary" icon={Plus}>
                    Create Worker
                </Button>
                <Button variant="secondary" icon={Plus} disabled>
                    Create Worker
                </Button>
            </div>
        ),
        input: (
            <div className="w-full max-w-[260px]">
                <Input
                    label="Email"
                    placeholder="you@example.com"
                    description="We&apos;ll never share your email"
                />
            </div>
        ),
        select: (
            <Select
                className="w-[200px]"
                value={selectValue}
                onValueChange={(value) => setSelectValue(value ?? "v1.0.0")}
                placeholder="Select a version..."
                aria-label="Select version"
            >
                <Select.Option value="v1.0.0">v1.0.0</Select.Option>
                <Select.Option value="v1.1.0">v1.1.0</Select.Option>
                <Select.Option value="v2.0.0">v2.0.0</Select.Option>
            </Select>
        ),
        combobox: (
            <div className="w-full max-w-[220px]">
                <Combobox value={comboboxValue} onValueChange={setComboboxValue} items={issues}>
                    <Combobox.TriggerInput placeholder="Select an issue..." aria-label="Select issue" />
                    <Combobox.Content>
                        <Combobox.Empty />
                        <Combobox.List>
                            {(item) => (
                                <Combobox.Item key={item} value={item}>
                                    {item}
                                </Combobox.Item>
                            )}
                        </Combobox.List>
                    </Combobox.Content>
                </Combobox>
            </div>
        ),
        switch: (
            <div className="flex w-full items-center justify-center">
                <Switch
                    checked={switchChecked}
                    onCheckedChange={setSwitchChecked}
                    aria-label="Switch"
                />
            </div>
        ),
        "input-validation": (
            <div className="w-full max-w-[260px]">
                <Input
                    label="Email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    error={emailError}
                    variant={emailError ? "error" : "default"}
                />
            </div>
        ),
        dialog: (
            <Dialog.Root>
                <Dialog.Trigger render={(props) => <Button {...props}>Click me!</Button>} />
                <Dialog className="p-6">
                    <div className="mb-3 flex items-start justify-between gap-4">
                        <Dialog.Title className="text-lg font-semibold">
                            Modal Title
                        </Dialog.Title>
                        <Dialog.Close
                            aria-label="Close"
                            render={(props) => (
                                <Button {...props} variant="secondary" shape="square" icon={X} />
                            )}
                        />
                    </div>
                    <Dialog.Description className="text-kumo-subtle">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </Dialog.Description>
                </Dialog>
            </Dialog.Root>
        ),
        tooltip: (
            <TooltipProvider>
                <div className="flex items-center gap-2">
                    <Tooltip content="Add" asChild>
                        <Button shape="square" icon={Plus} aria-label="Add" />
                    </Tooltip>
                    <Tooltip content="Format" asChild>
                        <Button shape="square" icon={TextB} aria-label="Format" />
                    </Tooltip>
                </div>
            </TooltipProvider>
        ),
        dropdown: (
            <DropdownMenu>
                <DropdownMenu.Trigger render={(props) => (
                    <Button {...props} icon={Plus}>
                        Add
                    </Button>
                )}
                />
                <DropdownMenu.Content>
                    <DropdownMenu.Item>Worker</DropdownMenu.Item>
                    <DropdownMenu.Item>Pages</DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu>
        ),
        collapsible: (
            <div className="w-full">
                <Collapsible
                    label="What is Kumo?"
                    open={collapsibleOpen}
                    onOpenChange={setCollapsibleOpen}
                >
                    Kumo is Cloudflare&apos;s design system.
                </Collapsible>
            </div>
        ),
        checkbox: (
            <Checkbox
                label="Max bandwidth"
                checked={checkboxChecked}
                onCheckedChange={setCheckboxChecked}
            />
        ),
        "layer-card": (
            <LayerCard>
                <LayerCard.Secondary className="flex items-center justify-between">
                    <div>Next Steps</div>
                    <Button variant="ghost" size="sm" shape="square" icon={ArrowRight} />
                </LayerCard.Secondary>
                <LayerCard.Primary>Hello</LayerCard.Primary>
            </LayerCard>
        ),
    }

    return (
        <div
            className="grid grid-cols-1 gap-px border border-kumo-line/60 bg-kumo-line/60 md:grid-cols-2 xl:grid-cols-4"
            data-registry-grid
        >
            {COMPONENT_GRID_ITEMS.map((item) => (
                <ComponentCell
                    key={item.id}
                    title={item.title}
                >
                    {renderers[item.id]}
                </ComponentCell>
            ))}
        </div>
    )
}

export { ComponentGrid }
