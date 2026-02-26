/**
 * [INPUT]: 依赖 @/components/ui/kumo(Button/ClipboardText/Surface/Text/Banner/Badge), @phosphor-icons/react(XIcon/Warning), @/lib/utils(cn), i18n t() 与平台参数，以及可选宿主样式注入（containerClassName/asideClassName/visibilityClassName）
 * [OUTPUT]: 对外提供 SetupGuidePanel 组件（右侧设置区或 HomeGrid 中档整区的局部覆盖层 + 右滑引导面板 + iOS/Android 步骤渲染，仅内容区可滚）
 * [POS]: registry/sections/workspace 的 Year/Goal 收口卡后续动作承载层，被 HomeGrid/HomeSettingsPane 双宿主复用；步骤卡统一使用 Kumo Surface 组件并收敛滚动职责
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { Badge, Banner, Button as KumoButton, ClipboardText, Surface, Text } from "@/components/ui/kumo"
import { Warning, XIcon } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

const IOS_BASE_STEPS = [
    ["setup.ios.step1", "setup.ios.step1Desc"],
    ["setup.ios.step2", "setup.ios.step2Desc"],
]

const ANDROID_FINAL_STEP = ["setup.android.step5", "setup.android.step5Desc"]
const STEP_CARD_SURFACE_CLASSNAME = "space-y-2 rounded-lg border border-kumo-line bg-kumo-control px-3 py-3 ring-0 shadow-none"
const STEP_INDEX_BADGE_CLASSNAME = "inline-flex size-5 items-center justify-center rounded-full bg-kumo-tint text-xs leading-none"
const STEP_DESC_TEXT_CLASSNAME = "text-sm leading-5 text-kumo-subtle [&_strong]:font-semibold [&_strong]:text-kumo-default"
const DEFAULT_CONTAINER_CLASSNAME = "pointer-events-none absolute inset-0 z-40 overflow-hidden overscroll-none"
const DEFAULT_ASIDE_CLASSNAME =
    "pointer-events-auto absolute inset-y-0 right-0 flex w-full max-w-full flex-col border-l border-kumo-line bg-kumo-elevated transition-transform duration-300 ease-out md:w-[86%] lg:w-full lg:border-l-0"

function SetupGuideAlertBanner({ html }) {
    return (
        <Banner variant="alert" icon={<span className="flex items-center h-5"><Warning size={16} weight="fill" /></span>} className="w-fit">
            <Text as="p" variant="body" size="sm" DANGEROUS_className="m-0 leading-5 !text-inherit [&_strong]:font-semibold [&_strong]:text-current">
                <span dangerouslySetInnerHTML={{ __html: html }} />
            </Text>
        </Banner>
    )
}

function SetupGuideStep({ index, title, descriptionHtml, badgeLabel }) {
    return (
        <Surface className={STEP_CARD_SURFACE_CLASSNAME}>
            <header className="inline-flex items-center gap-2">
                <span className={STEP_INDEX_BADGE_CLASSNAME}>
                    {index}
                </span>
                <Text as="h4" variant="body" size="sm" bold>{title}</Text>
                {badgeLabel ? <Badge variant="secondary">{badgeLabel}</Badge> : null}
            </header>
            <div
                className={STEP_DESC_TEXT_CLASSNAME}
                dangerouslySetInnerHTML={{ __html: descriptionHtml }}
            />
        </Surface>
    )
}

function IOSShortcutStep({ index, t, url }) {
    const resolvedUrl = url || t("url.placeholder")

    return (
        <Surface className={STEP_CARD_SURFACE_CLASSNAME}>
            <header className="inline-flex items-center gap-2">
                <span className={STEP_INDEX_BADGE_CLASSNAME}>
                    {index}
                </span>
                <Text as="h4" variant="body" size="sm" bold>{t("setup.ios.step3")}</Text>
            </header>
            <div className={`space-y-2.5 ${STEP_DESC_TEXT_CLASSNAME}`}>
                <div className="space-y-1">
                    <Text as="p" variant="body" size="sm" bold>{t("setup.ios.step3.action1")}</Text>
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
                </div>
                <div className="space-y-1">
                    <Text as="p" variant="body" size="sm" bold>{t("setup.ios.step3.action2")}</Text>
                    <div dangerouslySetInnerHTML={{ __html: t("setup.ios.step3.action2Desc") }} />
                </div>
            </div>
        </Surface>
    )
}

function SetupGuidePanel({
    open,
    platform,
    onClose,
    t,
    url,
    containerClassName,
    asideClassName,
    visibilityClassName,
}) {
    const isAndroid = platform === "android"
    const platformLabel = isAndroid ? t("setup.android") : t("setup.ios")
    const setupTitle = `${platformLabel} ${t("setup.title")}`

    return (
        <div
            data-home-settings-setup-panel
            aria-hidden={!open}
            className={cn(DEFAULT_CONTAINER_CLASSNAME, visibilityClassName, containerClassName)}
        >
            <aside
                role="dialog"
                aria-modal={open}
                aria-label={setupTitle}
                className={cn(
                    DEFAULT_ASIDE_CLASSNAME,
                    asideClassName,
                    open ? "translate-x-0" : "translate-x-full"
                )}
            >
                <header className="relative flex items-start border-b border-kumo-line px-4 py-4">
                    <div>
                        <Text as="h3" variant="heading3" DANGEROUS_className="leading-6">{setupTitle}</Text>
                    </div>
                    <KumoButton
                        className="absolute top-2 right-2"
                        variant="ghost"
                        shape="square"
                        aria-label={t("registry.menu.close")}
                        onClick={onClose}
                    >
                        <XIcon size={16} weight="bold" />
                    </KumoButton>
                </header>

                <div className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-y-contain p-4">
                    {!isAndroid && (
                        <>
                            <SetupGuideStep
                                index={1}
                                title={t(IOS_BASE_STEPS[0][0])}
                                descriptionHtml={t(IOS_BASE_STEPS[0][1])}
                                badgeLabel={t("setup.step.completed")}
                            />
                            <SetupGuideStep index={2} title={t(IOS_BASE_STEPS[1][0])} descriptionHtml={t(IOS_BASE_STEPS[1][1])} />
                            <IOSShortcutStep index={3} t={t} url={url} />
                            <Surface className={STEP_CARD_SURFACE_CLASSNAME}>
                                <header className="inline-flex items-center gap-2">
                                    <span className={STEP_INDEX_BADGE_CLASSNAME}>
                                        4
                                    </span>
                                    <Text as="h4" variant="body" size="sm" bold>{t("setup.ios.step4")}</Text>
                                </header>
                                <SetupGuideAlertBanner html={t("setup.ios.step4Warning")} />
                            </Surface>
                        </>
                    )}

                    {isAndroid && (
                        <>
                            <SetupGuideStep
                                index={1}
                                title={t("setup.android.step1")}
                                descriptionHtml={t("setup.android.step1Desc")}
                                badgeLabel={t("setup.step.completed")}
                            />
                            <SetupGuideStep index={2} title={t("setup.android.step2")} descriptionHtml={t("setup.android.step2Desc")} />
                            <SetupGuideStep index={3} title={t("setup.android.step3")} descriptionHtml={t("setup.android.step3Desc")} />

                            <Surface className={STEP_CARD_SURFACE_CLASSNAME}>
                                <header className="inline-flex items-center gap-2">
                                    <span className={STEP_INDEX_BADGE_CLASSNAME}>
                                        4
                                    </span>
                                    <Text as="h4" variant="body" size="sm" bold>{t("setup.android.step4")}</Text>
                                </header>
                                <div className="space-y-2.5">
                                    <div className="space-y-2 rounded-md bg-kumo-elevated px-2.5 py-2">
                                        <Text as="p" variant="body" size="sm" bold>{t("setup.android.step4_1")}</Text>
                                        <div className="space-y-1">
                                            <div
                                                className={STEP_DESC_TEXT_CLASSNAME}
                                                dangerouslySetInnerHTML={{ __html: t("setup.android.step4_1Desc") }}
                                            />
                                            <SetupGuideAlertBanner html={t("setup.android.step4_1Tip")} />
                                        </div>
                                    </div>
                                    <div className="space-y-2 rounded-md bg-kumo-elevated px-2.5 py-2">
                                        <Text as="p" variant="body" size="sm" bold>{t("setup.android.step4_2")}</Text>
                                        <div
                                            className={STEP_DESC_TEXT_CLASSNAME}
                                            dangerouslySetInnerHTML={{ __html: t("setup.android.step4_2Desc") }}
                                        />
                                    </div>
                                </div>
                            </Surface>

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
