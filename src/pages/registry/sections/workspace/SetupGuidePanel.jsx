/**
 * [INPUT]: 依赖 @/components/ui/kumo(Button/ClipboardText), @phosphor-icons/react(XIcon), @/lib/utils(cn), i18n t() 与平台参数
 * [OUTPUT]: 对外提供 SetupGuidePanel 组件（右侧设置区内局部覆盖层 + 右滑引导面板 + iOS/Android 步骤渲染）
 * [POS]: registry/sections/workspace 的 Year/Goal 收口卡后续动作承载层（Year 第⑤、Goal 第⑥共用），负责“Set it”后的人机引导闭环
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { Button as KumoButton, ClipboardText } from "@/components/ui/kumo"
import { XIcon } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

const IOS_STEPS = [
    ["setup.ios.step1", "setup.ios.step1Desc"],
    ["setup.ios.step2", "setup.ios.step2Desc"],
    ["setup.ios.step4", "setup.ios.step4Desc"],
]

const ANDROID_FINAL_STEP = ["setup.android.step5", "setup.android.step5Desc"]

function SetupGuideStep({ index, title, descriptionHtml }) {
    return (
        <article className="space-y-2 rounded-lg border border-kumo-line bg-kumo-control px-3 py-3">
            <header className="inline-flex items-center gap-2 text-sm font-medium text-kumo-default">
                <span className="inline-flex size-5 items-center justify-center rounded-full bg-kumo-tint text-xs leading-none">
                    {index}
                </span>
                <h4>{title}</h4>
            </header>
            <div
                className="text-xs leading-5 text-kumo-subtle [&_strong]:font-semibold [&_strong]:text-kumo-default"
                dangerouslySetInnerHTML={{ __html: descriptionHtml }}
            />
        </article>
    )
}

function IOSShortcutStep({ index, t, url }) {
    const resolvedUrl = url || t("url.placeholder")

    return (
        <article className="space-y-2 rounded-lg border border-kumo-line bg-kumo-control px-3 py-3">
            <header className="inline-flex items-center gap-2 text-sm font-medium text-kumo-default">
                <span className="inline-flex size-5 items-center justify-center rounded-full bg-kumo-tint text-xs leading-none">
                    {index}
                </span>
                <h4>{t("setup.ios.step3")}</h4>
            </header>
            <div className="space-y-2 text-xs leading-5 text-kumo-subtle [&_strong]:font-semibold [&_strong]:text-kumo-default">
                <p>
                    <strong>{t("setup.ios.step3.action1")}</strong>
                </p>
                <ClipboardText
                    text={resolvedUrl}
                    size="base"
                    className="w-3/4 max-w-full"
                    tooltip={{
                        text: t("setup.ios.step3.copyTooltip"),
                        copiedText: t("setup.ios.step3.copiedTooltip"),
                        side: "top",
                    }}
                    labels={{ copyAction: t("setup.ios.step3.copyAction") }}
                />
                <p>
                    <strong>{t("setup.ios.step3.action2")}</strong>
                </p>
                <div dangerouslySetInnerHTML={{ __html: t("setup.ios.step3.action2Desc") }} />
            </div>
        </article>
    )
}

function SetupGuidePanel({ open, platform, onClose, t, url }) {
    const isAndroid = platform === "android"
    const platformLabel = isAndroid ? t("setup.android") : t("setup.ios")
    const setupTitle = `${platformLabel} ${t("setup.title")}`

    return (
        <div
            data-home-settings-setup-panel
            aria-hidden={!open}
            className="pointer-events-none absolute inset-0 z-40"
        >
            <aside
                className={cn(
                    "pointer-events-auto absolute inset-y-0 right-0 flex w-full max-w-full flex-col border-l border-kumo-line bg-kumo-elevated transition-transform duration-300 ease-out md:w-[86%] lg:w-full lg:border-l-0",
                    open ? "translate-x-0" : "translate-x-full"
                )}
            >
                <header className="flex items-start justify-between border-b border-kumo-line px-4 py-4">
                    <div>
                        <h3 className="text-lg leading-6 font-semibold text-kumo-default">{setupTitle}</h3>
                    </div>
                    <KumoButton
                        variant="ghost"
                        shape="square"
                        aria-label={t("registry.menu.close")}
                        onClick={onClose}
                    >
                        <XIcon size={16} weight="bold" />
                    </KumoButton>
                </header>

                <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
                    {!isAndroid && (
                        <>
                            <SetupGuideStep index={1} title={t(IOS_STEPS[0][0])} descriptionHtml={t(IOS_STEPS[0][1])} />
                            <SetupGuideStep index={2} title={t(IOS_STEPS[1][0])} descriptionHtml={t(IOS_STEPS[1][1])} />
                            <IOSShortcutStep index={3} t={t} url={url} />
                            <SetupGuideStep index={4} title={t(IOS_STEPS[2][0])} descriptionHtml={t(IOS_STEPS[2][1])} />
                        </>
                    )}

                    {isAndroid && (
                        <>
                            <SetupGuideStep index={1} title={t("setup.android.step1")} descriptionHtml={t("setup.android.step1Desc")} />
                            <SetupGuideStep index={2} title={t("setup.android.step2")} descriptionHtml={t("setup.android.step2Desc")} />
                            <SetupGuideStep index={3} title={t("setup.android.step3")} descriptionHtml={t("setup.android.step3Desc")} />

                            <article className="space-y-2 rounded-lg border border-kumo-line bg-kumo-control px-3 py-3">
                                <header className="inline-flex items-center gap-2 text-sm font-medium text-kumo-default">
                                    <span className="inline-flex size-5 items-center justify-center rounded-full bg-kumo-tint text-xs leading-none">
                                        4
                                    </span>
                                    <h4>{t("setup.android.step4")}</h4>
                                </header>
                                <div className="space-y-2">
                                    <div className="space-y-1.5 rounded-md bg-kumo-elevated px-2.5 py-2">
                                        <p className="text-xs font-medium text-kumo-default">{t("setup.android.step4_1")}</p>
                                        <div
                                            className="text-xs leading-5 text-kumo-subtle [&_strong]:font-semibold [&_strong]:text-kumo-default"
                                            dangerouslySetInnerHTML={{ __html: t("setup.android.step4_1Desc") }}
                                        />
                                    </div>
                                    <div className="space-y-1.5 rounded-md bg-kumo-elevated px-2.5 py-2">
                                        <p className="text-xs font-medium text-kumo-default">{t("setup.android.step4_2")}</p>
                                        <div
                                            className="text-xs leading-5 text-kumo-subtle [&_strong]:font-semibold [&_strong]:text-kumo-default"
                                            dangerouslySetInnerHTML={{ __html: t("setup.android.step4_2Desc") }}
                                        />
                                    </div>
                                </div>
                            </article>

                            <SetupGuideStep
                                index={5}
                                title={t(ANDROID_FINAL_STEP[0])}
                                descriptionHtml={t(ANDROID_FINAL_STEP[1])}
                            />
                        </>
                    )}
                </div>
            </aside>
        </div>
    )
}

export { SetupGuidePanel }
