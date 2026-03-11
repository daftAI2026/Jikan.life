/**
 * [INPUT]: 依赖 node:test/node:assert 与 tests/helpers/source-test-helpers
 * [OUTPUT]: 向 `node --test` 注册 Workspace/Settings 迁移护栏用例，覆盖工作区配置、设备/日期卡片、SetupGuidePanel、HomeGrid、预览缩放与通用 skeleton 语义
 * [POS]: tests/ UI 迁移护栏的复杂交互层，锁定 workspace 卡片、setup 流程与预览语义
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { test } from "node:test"
import assert from "node:assert/strict"
import { assertNamedImports, fs, listFiles, path, pathToFileURL, readSource } from "./helpers/source-test-helpers.js"

test("Registry workspace no longer hardcodes UI language to English", () => {
  const source = readSource("src/pages/registry/sections/workspace/useHomeWallpaperConfig.js")
  const mapperSource = readSource("src/pages/registry/sections/workspace/view-model-mappers.js")

  assert.match(source, /useI18n/)
  assert.match(source, /LANGUAGE_META/)
  assert.match(source, /const\s+\{\s*t\s*\}\s*=\s*useI18n\(\)/)
  assert.match(source, /mapLanguageOptions\(LANGUAGE_META,\s*t\)/)
  assert.match(mapperSource, /flag:\s*meta\.flag/)
  assert.match(mapperSource, /name:\s*t\(meta\.labelKey\)/)
  assert.doesNotMatch(source, /REGISTRY_UI_LANG/)
  assert.doesNotMatch(source, /createEnglishTranslator/)
})

test("Registry config keeps selectedType empty before style selection", () => {
  const source = readSource("src/pages/registry/sections/workspace/useHomeWallpaperConfig.js")
  const initSource = readSource("src/pages/registry/sections/workspace/config-init.js")
  const urlBuilderSource = readSource("src/pages/registry/sections/workspace/url-builder.js")

  assert.match(initSource, /function resolveSelectedType\(selectedStyle\)/)
  assert.match(initSource, /return STYLE_TO_TYPE\[selectedStyle\] \?\? null/)
  assert.match(source, /const selectedType = resolveSelectedType\(selectedStyle\)/)
  assert.match(urlBuilderSource, /if \(!config\.selectedType\) return ""/)
})

test("Registry settings wallpaper language uses flag + name rendering", () => {
  const source = readSource("src/pages/registry/sections/workspace/cards/wallpaper-lang-card.jsx")

  assert.match(source, /inline-flex items-center gap-1\.5/)
  assert.match(source, /option\.flag/)
  assert.match(source, /option\.name/)
})

test("Registry settings does not render selected type badge", () => {
  const source = readSource("src/pages/registry/sections/workspace/HomeSettingsPane.jsx")
  const homeGridSource = readSource("src/pages/registry/sections/components/HomeGrid.jsx")
  const hookSource = readSource("src/pages/registry/sections/workspace/useHomeWallpaperConfig.js")

  assert.doesNotMatch(source, /customize\.selected/)
  assert.doesNotMatch(homeGridSource, /typeName={viewModel\.typeName}/)
  assert.doesNotMatch(hookSource, /typeName/)
  assert.doesNotMatch(hookSource, /getTypeName/)
})

test("Registry settings colors keep lg picker layout and hide presets in mid year/goal", () => {
  const source = readSource("src/pages/registry/sections/workspace/cards/colors-card.jsx")
  const fieldShellSource = readSource("src/pages/registry/sections/workspace/cards/CardField.jsx")

  assertNamedImports(source, "@/components/ui/color-picker", ["ColorPicker"])
  assertNamedImports(source, "./CardField", ["CardField", "CardFieldsStack"])
  assert.match(source, /titleKey:\s*"config\.colors"/)
  assert.match(source, /<CardFieldsStack>/)
  assert.match(source, /render:\s*\(\{\s*actions,\s*config,\s*effectiveLayoutTier,\s*palettePresets,\s*t\s*\}\)\s*=>/)
  assert.match(
    source,
    /const isMidYearOrGoal = effectiveLayoutTier === "mid" && \(config\.selectedType === "year" \|\| config\.selectedType === "goal"\)/
  )
  assert.match(source, /if \(isMidYearOrGoal\) \{/)
  assert.match(fieldShellSource, /flex w-full max-w-full flex-col items-center px-4 py-1/)
  assert.match(fieldShellSource, /gap-4/)
  assert.match(source, /className:\s*"grid w-\[200px\] max-w-full grid-cols-2 gap-2"/)
  assert.doesNotMatch(source, /className:\s*"w-\[200px\] max-w-full grid grid-cols-4 gap-2"/)
  assert.match(source, /className="min-w-0"/)
  assert.match(source, /className="mb-1\.5 text-xs text-kumo-subtle"/)
  assert.doesNotMatch(source, /className="min-w-0 space-y-1\.5"/)
  assert.match(source, /ColorPicker[\s\S]*?className="w-full"/)
  assert.match(source, /t\("config\.background"\)[\s\S]*?<ColorPicker[\s\S]*?showValue=\{false\}/)
  assert.match(source, /t\("config\.accent"\)[\s\S]*?<ColorPicker[\s\S]*?showValue=\{false\}/)
  assert.match(source, /actions\.setBackgroundColor/)
  assert.match(source, /actions\.setAccentColor/)
  assert.match(source, /actions\.applyPalette\(preset\.bg,\s*preset\.accent\)/)
  assert.match(source, /className:\s*"flex w-\[200px\] max-w-full flex-wrap gap-2"/)
  assert.match(source, /<CardField label=\{t\("config\.colorPresets"\)\} labelClassName="block">/)
  assert.match(fieldShellSource, /w-\[200px\] max-w-full/)
  assert.doesNotMatch(source, /title:\s*"Switch"/)
  assert.doesNotMatch(source, /<Switch/)
  assert.doesNotMatch(source, /type="color"/)
})

test("Registry settings device card uses grouped Select without resolution hint", () => {
  const source = readSource("src/pages/registry/sections/workspace/cards/device-card.jsx")

  assert.match(source, /const SHOW_DEVICE_RESOLUTION_HINT = false/)
  assert.match(source, /titleKey:\s*"config\.device"/)
  assert.match(source, /titleTooltipKey:\s*"config\.deviceTooltip"/)
  assert.match(source, /actions\.setDevice/)
  assert.match(source, /className="w-\[200px\] max-w-full"/)
  assertNamedImports(source, "../device-visibility", ["VISIBLE_DEVICE_CATEGORIES"])
  assert.match(source, /VISIBLE_DEVICE_CATEGORIES\.map/)
  assert.match(source, /SelectBase\.Group/)
  assert.match(source, /const shouldShowGroupLabel = VISIBLE_DEVICE_CATEGORIES\.length > 1/)
  assert.match(source, /shouldShowGroupLabel && \(/)
  assert.match(source, /label=\{t\("config\.device"\)\}/)
  assert.match(
    source,
    /description=\{SHOW_DEVICE_RESOLUTION_HINT \? `\$\{t\("config\.deviceResolution"\)\}: \$\{selectedDevice\.width\} × \$\{selectedDevice\.height\}` : undefined\}/
  )
  assert.doesNotMatch(source, /<p className=\"w-\[200px\] max-w-full pl-\[12px\] text-xs text-kumo-subtle\">/)
  assert.doesNotMatch(source, /title:\s*"Dropdown"/)
  assert.doesNotMatch(source, /<DropdownMenu/)
  assert.doesNotMatch(source, /Worker/)
  assert.doesNotMatch(source, /Pages/)
})

test("Device data splits grouped iPhone labels into single-model entries and keeps legacy aliases", async () => {
  const source = readSource("src/data/devices.js")

  assert.match(source, /name:\s*"iPhone 16 Plus"/)
  assert.match(source, /name:\s*"iPhone 15 Pro Max"/)
  assert.match(source, /name:\s*"iPhone 15 Plus"/)
  assert.match(source, /name:\s*"iPhone 14 Pro Max"/)
  assert.match(source, /name:\s*"iPhone 16"/)
  assert.match(source, /name:\s*"iPhone 15 Pro"/)
  assert.match(source, /name:\s*"iPhone 15"/)
  assert.match(source, /name:\s*"iPhone 14 Pro"/)
  assert.match(source, /name:\s*"iPhone 14 Plus"/)
  assert.match(source, /name:\s*"iPhone 13 Pro Max"/)
  assert.match(source, /name:\s*"iPhone 14"/)
  assert.match(source, /name:\s*"iPhone 13 Pro"/)
  assert.match(source, /name:\s*"iPhone 13"/)

  assert.doesNotMatch(source, /name:\s*"iPhone 14 Pro Max \/ 15 Plus \/ 15 Pro Max \/ 16 Plus"/)
  assert.doesNotMatch(source, /name:\s*"iPhone 14 Pro \/ 15 \/ 15 Pro \/ 16"/)
  assert.doesNotMatch(source, /name:\s*"iPhone 13 Pro Max \/ 14 Plus"/)
  assert.doesNotMatch(source, /name:\s*"iPhone 13 \/ 13 Pro \/ 14"/)

  assert.match(source, /const LEGACY_DEVICE_NAME_MAP = \{/)
  assert.match(source, /export function normalizeDeviceName\(deviceName\)/)
  assert.match(source, /return LEGACY_DEVICE_NAME_MAP\[deviceName\] \?\? deviceName/)

  const moduleUrl = pathToFileURL(path.join(process.cwd(), "src/data/devices.js")).href
  const { devices } = await import(`${moduleUrl}?v=${Date.now()}`)
  const iphones = devices.filter((device) => device.category === "iPhone")
  const iphoneResolutionByName = new Map(
    iphones.map((device) => [device.name, `${device.width} x ${device.height}`])
  )

  assert.equal(iphoneResolutionByName.get("iPhone 17"), "1206 x 2622")
  assert.equal(iphoneResolutionByName.get("iPhone 17 Pro"), "1206 x 2622")
  assert.equal(iphoneResolutionByName.get("iPhone 17 Air"), "1260 x 2736")
  assert.equal(iphoneResolutionByName.get("iPhone 16 Pro"), "1206 x 2622")
  assert.equal(iphoneResolutionByName.get("iPhone 16 Pro Max"), "1320 x 2868")
  assert.equal(iphoneResolutionByName.get("iPhone 13 mini"), "1080 x 2340")
  assert.equal(iphoneResolutionByName.get("iPhone 12 mini"), "1080 x 2340")

  const seriesOrder = [
    "iPhone 17 Pro Max",
    "iPhone 17 Pro",
    "iPhone 17 Air",
    "iPhone 17",
    "iPhone 16 Pro Max",
    "iPhone 16 Pro",
    "iPhone 16 Plus",
    "iPhone 16",
    "iPhone 15 Pro Max",
    "iPhone 15 Pro",
    "iPhone 15 Plus",
    "iPhone 15",
    "iPhone 14 Pro Max",
    "iPhone 14 Pro",
    "iPhone 14 Plus",
    "iPhone 14",
    "iPhone 13 Pro Max",
    "iPhone 13 Pro",
    "iPhone 13",
    "iPhone 13 mini",
    "iPhone 12 mini",
  ]
  const seriesPositions = seriesOrder.map((deviceName) =>
    iphones.findIndex((device) => device.name === deviceName)
  )

  assert.ok(seriesPositions.every((index) => index >= 0))
  for (let i = 1; i < seriesPositions.length; i += 1) {
    assert.ok(seriesPositions[i] > seriesPositions[i - 1], `${seriesOrder[i - 1]} should come before ${seriesOrder[i]}`)
  }
})

test("Home wallpaper config normalizes device value before persisting", () => {
  const source = readSource("src/pages/registry/sections/workspace/useHomeWallpaperConfig.js")
  const actionsSource = readSource("src/pages/registry/sections/workspace/config-actions.js")

  assert.match(source, /normalizeDeviceName/)
  assert.match(actionsSource, /setDevice\(value\)\s*\{[\s\S]*?normalizeDeviceName\(value\)/)
  assertNamedImports(source, "./device-visibility", [
    "PRIMARY_VISIBLE_DEVICE_CATEGORY",
    "isVisibleDeviceCategory",
  ])
  assert.match(source, /isVisibleDeviceCategory\(resolvedDevice\?\.category\)/)
  assert.match(source, /device\.category === PRIMARY_VISIBLE_DEVICE_CATEGORY/)
})

test("Goal/Life slot 3 uses dedicated fields card and hides palettes card in active orders", () => {
  const source = readSource("src/pages/registry/sections/workspace/HomeSettingsPane.jsx")

  assert.match(source, /const YEAR_SETTINGS_CARD_IDS = \["location", "wallpaper-lang", "colors", "device", "url"\]/)
  assert.match(source, /const LIFE_SETTINGS_CARD_IDS = \["location", "wallpaper-lang", "life-fields", "colors", "device", "url"\]/)
  assert.match(source, /const GOAL_SETTINGS_CARD_IDS = \["location", "wallpaper-lang", "goal-fields", "colors", "device", "url"\]/)
  assert.match(source, /const CARD_ORDER_BY_TYPE = \{[\s\S]*?year:\s*YEAR_SETTINGS_CARD_IDS,[\s\S]*?life:\s*LIFE_SETTINGS_CARD_IDS,[\s\S]*?goal:\s*GOAL_SETTINGS_CARD_IDS,/)
  assert.doesNotMatch(source, /const YEAR_SETTINGS_CARD_IDS = \[[^\]]*"palettes"[^\]]*\]/)
  assert.doesNotMatch(source, /const LIFE_SETTINGS_CARD_IDS = \[[^\]]*"palettes"[^\]]*\]/)
  assert.doesNotMatch(source, /const GOAL_SETTINGS_CARD_IDS = \[[^\]]*"palettes"[^\]]*\]/)
})

test("Goal countdown keeps url card at slot 6 for Set flow", () => {
  const source = readSource("src/pages/registry/sections/workspace/HomeSettingsPane.jsx")

  assert.match(
    source,
    /const GOAL_SETTINGS_CARD_IDS = \["location", "wallpaper-lang", "goal-fields", "colors", "device", "url"\]/
  )
})

test("Goal fields card uses goal name + date range wiring with mid goal equal-width layout", () => {
  const source = readSource("src/pages/registry/sections/workspace/cards/goal-fields-card.jsx")
  const fieldShellSource = readSource("src/pages/registry/sections/workspace/cards/CardField.jsx")
  const rangeSource = readSource("src/pages/registry/sections/workspace/cards/goal-date-range-field.jsx")
  const i18nSource = readSource("src/data/i18n.js")

  assert.match(source, /titleKey:\s*"config\.goal"/)
  assert.doesNotMatch(source, /title:\s*"Goal"/)
  assertNamedImports(source, "./CardField", ["CardField", "CardFieldsStack"])
  assert.match(source, /<CardFieldsStack>/)
  assert.match(fieldShellSource, /function CardFieldsStack/)
  assert.match(source, /render:\s*\(\{\s*actions,\s*config,\s*effectiveLayoutTier,\s*t\s*\}\)\s*=>/)
  assert.match(source, /const isMidGoal = effectiveLayoutTier === "mid" && config\.selectedType === "goal"/)
  assert.match(source, /if \(isMidGoal\) \{/)
  assert.match(source, /grid w-full max-w-full grid-cols-2 items-start gap-2/)
  assert.match(source, /className="min-w-0 w-full"/)
  assert.match(source, /actions\.setGoalName/)
  assert.match(source, /actions\.setGoalRange/)
  assert.match(source, /t\("config\.dateRange"\)/)
  assert.match(source, /GoalDateRangeField/)
  assert.match(source, /className="w-full"/)
  assert.match(source, /triggerClassName="h-9 w-full justify-start gap-2 rounded-lg px-3 text-left font-normal"/)
  assert.match(source, /className="w-\[200px\] max-w-full"/)
  assert.match(rangeSource, /function GoalDateRangeField\(\{ startISO, endISO, onChange, t, triggerClassName \}\)/)
  assert.match(rangeSource, /import \{ cn \} from "@\/lib\/utils"/)
  assert.match(
    rangeSource,
    /className=\{cn\(\s*"h-9 w-\[200px\] max-w-full justify-start gap-2 rounded-lg px-3 text-left font-normal",\s*triggerClassName\s*\)\}/
  )
  assert.match(i18nSource, /'config\.goal':\s*'Goal'/)
  assert.match(i18nSource, /'config\.goal':\s*'目标'/)
  assert.match(i18nSource, /'config\.goal':\s*'目標'/)
  assert.match(i18nSource, /'config\.goal':\s*'目標'/)
  assert.doesNotMatch(source, /SettingsCardDatePickerField/)
})

test("Life fields card uses dob/lifespan bindings and keeps hints in card view", () => {
  const source = readSource("src/pages/registry/sections/workspace/cards/life-fields-card.jsx")
  const i18nSource = readSource("src/data/i18n.js")

  assert.match(source, /titleKey:\s*"config\.life"/)
  assert.doesNotMatch(source, /title:\s*"Life"/)
  assert.match(source, /actions\.setDob/)
  assert.match(source, /actions\.setLifespan/)
  assert.match(source, /actions\.normalizeLifespan/)
  assert.match(source, /DatePicker/)
  assert.match(source, /mode="single"/)
  assert.match(source, /disabled=\{todayDate \? \[\{ after: todayDate \}\] : undefined\}/)
  assert.match(source, /Popover/)
  assert.match(source, /variant="outline"/)
  assert.match(source, /type="number"/)
  assert.match(source, /min=\{50\}/)
  assert.match(source, /max=\{120\}/)
  assert.match(source, /t\("config\.dateOfBirthHint"\)/)
  assert.match(source, /t\("config\.lifespanHint"\)/)
  assert.match(source, /className="w-\[200px\] max-w-full"/)
  assert.match(i18nSource, /'config\.life':\s*'Life'/)
  assert.match(i18nSource, /'config\.life':\s*'生命'/)
  assert.match(i18nSource, /'config\.life':\s*'生命'/)
  assert.match(i18nSource, /'config\.life':\s*'人生'/)
  assert.doesNotMatch(source, /SettingsCardDatePickerField/)
  assert.doesNotMatch(source, /maxValue=\{todayISO\}/)
})

test("Goal url card uses setup title and set flow guarded by copy success", () => {
  const gridSource = readSource("src/pages/registry/sections/components/HomeGrid.jsx")
  const paneSource = readSource("src/pages/registry/sections/workspace/HomeSettingsPane.jsx")
  const urlSource = readSource("src/pages/registry/sections/workspace/cards/url-card.jsx")

  assert.match(gridSource, /const SETUP_FLOW_TYPES = new Set\(\["year", "goal"\]\)/)
  assert.match(urlSource, /const SETUP_FLOW_TYPES = new Set\(\["year", "goal"\]\)/)
  assert.match(urlSource, /function renderMidAnchoredUrlRow\(\{ onSetIt, t, url \}\)/)
  assert.match(urlSource, /render: \(\{ config, effectiveLayoutTier, onSetIt, t, url, useAnchoredSetupRow \}\) =>/)
  assert.match(urlSource, /resolveTitle:\s*\(\{\s*config,\s*t\s*\}\)\s*=>[\s\S]*?SETUP_FLOW_TYPES\.has\(config\.selectedType\)\s*\?\s*t\("setup\.title"\)\s*:\s*"Collapsible"/)
  assert.match(urlSource, /const isMidGoal = config\.selectedType === "goal" && effectiveLayoutTier === "mid"/)
  assert.match(urlSource, /const shouldUseAnchoredSetupRow = useAnchoredSetupRow \|\| isMidYear \|\| isMidGoal/)
  assert.match(urlSource, /return renderMidAnchoredUrlRow\(\{ onSetIt, t, url \}\)/)
  assert.match(urlSource, /if\s*\(config\.selectedType === "goal"\)/)
  assert.match(urlSource, /w-\[220px\] max-w-full flex-col gap-2 px-3 py-1/)
  assert.match(urlSource, /KumoButton[\s\S]*?variant="secondary"/)
  assert.match(urlSource, /w-full justify-center text-center transition-colors not-disabled:hover:!bg-kumo-tint/)
  assert.match(urlSource, /variant="secondary"/)
  assert.match(urlSource, /not-disabled:hover:!bg-kumo-tint/)
  assert.match(urlSource, /t\("url\.set"\)/)
  assert.match(urlSource, /onClick=\{\(event\) => void onSetIt\(event\.currentTarget\)\}/)
  assert.match(gridSource, /const \[isSetupPanelOpen, setIsSetupPanelOpen\] = useState\(false\)/)
  assert.match(gridSource, /const \[setupPlatform, setSetupPlatform\] = useState\("ios"\)/)
  assert.match(gridSource, /const setupTriggerRef = useRef\(null\)/)
  assert.match(gridSource, /const handleSetIt = async \(triggerElement\) => \{[\s\S]*?const ok = await viewModel\.actions\.copyUrl\(\)/)
  assert.match(gridSource, /const handleSetIt = async \(triggerElement\) => \{[\s\S]*?if \(!ok\) return/)
  assert.match(gridSource, /setupTriggerRef\.current = triggerElement \?\? null/)
  assert.match(gridSource, /window\.requestAnimationFrame\(\(\) => \{[\s\S]*?setupTriggerRef\.current\?\.focus\?\.\(\{ preventScroll: true \}\)/)
  assert.match(gridSource, /useEffect\(\(\) => \{[\s\S]*?if \(!SETUP_FLOW_TYPES\.has\(viewModel\.config\.selectedType\)\) \{/)
  assert.match(gridSource, /viewModel\.selectedDevice\.category === "Android" \? "android" : "ios"/)
  assert.match(gridSource, /useRegistryBlockingScrollLock\(isSetupPanelOpen\)/)
  assert.match(gridSource, /containerClassName="overflow-hidden overscroll-none"/)
  assert.match(gridSource, /asideClassName="md:w-full md:border-l-0 md:border-r"/)
  assert.match(gridSource, /const useSegmentedWorkspaceLayout = shouldUseSegmentedWorkspace\(\{ effectiveLayoutTier, sidebarOpen \}\)/)
  assert.match(gridSource, /const shouldRenderGridGuideHost = effectiveLayoutTier === "md" && sidebarOpen/)
  assert.match(gridSource, /const shouldRenderMobileGuideHost = effectiveLayoutTier === "mobile"/)
  assert.match(gridSource, /const shouldRenderPaneGuideHost = !shouldRenderGridGuideHost && !shouldRenderMobileGuideHost/)
  assert.match(gridSource, /\{shouldRenderGridGuideHost \? \(/)
  assert.match(gridSource, /\{shouldRenderMobileGuideHost \? \(/)
  assert.match(gridSource, /className="pointer-events-none absolute inset-0 z-40 md:hidden"/)
  assert.match(gridSource, /isDesktopShell \? "md:hidden" : ""/)
  assert.match(gridSource, /const paneEffectiveLayoutTier = effectiveLayoutTier === "md" && !sidebarOpen \? "mid" : effectiveLayoutTier/)
  assert.match(gridSource, /effectiveLayoutTier=\{paneEffectiveLayoutTier\}/)
  assert.match(gridSource, /shouldRenderPaneGuideHost=\{shouldRenderPaneGuideHost\}/)
  assert.match(gridSource, /<SetupGuidePanel[\s\S]*?open=\{isSetupPanelOpen\}/)
  assert.match(gridSource, /<SetupGuidePanel[\s\S]*?platform=\{setupPlatform\}/)
  assert.match(gridSource, /<SetupGuidePanel[\s\S]*?onClose=\{handleCloseSetupPanel\}/)
  assert.match(gridSource, /<SetupGuidePanel[\s\S]*?url=\{viewModel\.url\}/)
  assert.match(paneSource, /onSetIt,/)
  assert.match(paneSource, /const shouldUseAnchoredSetupRow = effectiveLayoutTier === "mid" \|\| useSegmentedWorkspaceLayout/)
  assert.match(paneSource, /const cardViewModel = \{[\s\S]*useAnchoredSetupRow: shouldUseAnchoredSetupRow,[\s\S]*\}/)
  assert.match(paneSource, /const cardViewModel = \{[\s\S]*effectiveLayoutTier,[\s\S]*\}/)
  assert.match(paneSource, /isSetupPanelOpen,/)
  assert.match(paneSource, /setupPlatform,/)
  assert.match(paneSource, /onCloseSetupPanel,/)
  assert.match(paneSource, /shouldRenderPaneGuideHost = true,/)
  assert.match(paneSource, /\{shouldRenderPaneGuideHost \? \(/)
  assert.doesNotMatch(paneSource, /effectiveLayoutTier !== "md"/)
  assert.doesNotMatch(paneSource, /guideVisibilityClassName/)
  assert.doesNotMatch(paneSource, /visibilityClassName=\{guideVisibilityClassName\}/)
  assert.doesNotMatch(paneSource, /const \[isSetupPanelOpen, setIsSetupPanelOpen\] = useState/)
  assert.doesNotMatch(paneSource, /const handleSetIt = async \(\) => \{/)
})

test("Year merged slot uses setup url card as slot 5 with compact inline row on md+", () => {
  const source = readSource("src/pages/registry/sections/workspace/HomeSettingsPane.jsx")
  const urlSource = readSource("src/pages/registry/sections/workspace/cards/url-card.jsx")

  assert.match(source, /const YEAR_SETTINGS_CARD_IDS = \["location", "wallpaper-lang", "colors", "device", "url"\]/)
  assert.match(source, /const CARD_SHELL_CLASS_BY_TYPE = \{[\s\S]*?year:\s*\{[\s\S]*?url:\s*"md:col-span-2"/)
  assert.match(source, /className=\{resolveCardShellClassName\(\{ selectedType: config\.selectedType, cardId, isMid \}\)\}/)
  assert.match(source, /if \(isMid\) return ""/)
  assert.match(urlSource, /render: \(\{ config, effectiveLayoutTier, onSetIt, t, url, useAnchoredSetupRow \}\) =>/)
  assert.match(urlSource, /const shouldUseAnchoredSetupRow = useAnchoredSetupRow \|\| isMidYear \|\| isMidGoal/)
  assert.match(urlSource, /if\s*\(config\.selectedType === "year"\)/)
  assert.match(urlSource, /const isMidYear = config\.selectedType === "year" && effectiveLayoutTier === "mid"/)
  assert.match(urlSource, /if \(shouldUseAnchoredSetupRow\) \{/)
  assert.match(urlSource, /return renderMidAnchoredUrlRow\(\{ onSetIt, t, url \}\)/)
  assert.match(urlSource, /className="w-full px-4 py-1"/)
  assert.match(urlSource, /grid-cols-\[minmax\(0,1fr\)_auto\]/)
  assert.match(urlSource, /items-center gap-2/)
  assert.match(urlSource, /className="min-w-0 w-full font-mono text-xs"/)
  assert.match(
    urlSource,
    /className="min-w-\[88px\] shrink-0 justify-center px-4 text-center transition-colors not-disabled:hover:!bg-kumo-tint"/
  )
  assert.match(urlSource, /w-full px-4 py-1/)
  assert.match(urlSource, /md:px-\[calc\(25%-100px\)\]/)
  assert.match(urlSource, /flex max-w-full flex-col gap-2 md:flex-row md:items-center md:gap-2/)
  assert.match(urlSource, /className="min-w-0 w-full font-mono text-xs md:flex-1"/)
  assert.match(urlSource, /variant="secondary"/)
  assert.match(
    urlSource,
    /className="min-w-\[88px\] justify-center px-4 text-center transition-colors not-disabled:hover:!bg-kumo-tint md:shrink-0"/
  )
  assert.match(urlSource, /not-disabled:hover:!bg-kumo-tint/)
  assert.doesNotMatch(urlSource, /md:grid-cols-2/)
})

test("Setup guide panel uses local right-slide overlay with sidebar-aligned timing", () => {
  const source = readSource("src/pages/registry/sections/workspace/SetupGuidePanel.jsx")
  const cssSource = readSource("src/index.css")
  const i18nSource = readSource("src/data/i18n.js")

  assert.match(source, /containerClassName/)
  assert.match(source, /asideClassName/)
  assert.match(source, /visibilityClassName/)
  assert.match(source, /const DEFAULT_CONTAINER_CLASSNAME = "pointer-events-none absolute inset-0 z-40 overflow-hidden overscroll-none"/)
  assert.match(source, /const DEFAULT_ASIDE_CLASSNAME =/)
  assert.match(source, /data-home-settings-setup-panel/)
  assert.match(source, /className=\{cn\(DEFAULT_CONTAINER_CLASSNAME,\s*visibilityClassName,\s*containerClassName\)\}/)
  assert.match(source, /pointer-events-none absolute inset-0 z-40 overflow-hidden overscroll-none/)
  assert.match(source, /className=\{cn\(\s*DEFAULT_ASIDE_CLASSNAME,\s*asideClassName,/)
  assert.match(source, /role="dialog"/)
  assert.match(source, /aria-modal=\{open \? true : undefined\}/)
  assert.match(source, /aria-hidden=\{!open\}/)
  assert.match(source, /inert=\{open \? undefined : true\}/)
  assert.match(source, /pointer-events-auto absolute inset-y-0 right-0/)
  assert.match(source, /transition-transform duration-300 ease-out/)
  assert.match(source, /open \? "translate-x-0" : "translate-x-full"/)
  assertNamedImports(source, "@/components/ui/kumo", [
    "Banner",
    "Button as KumoButton",
    "ClipboardText",
    "Surface",
    "Text",
  ])
  assert.match(source, /<header className="relative flex items-start border-b border-kumo-line px-4 py-4">/)
  assert.match(source, /<Text as="h3" variant="heading3" DANGEROUS_className="leading-6">/)
  assert.match(source, /<Text as="h4" variant="body" size="sm" bold>/)
  assert.match(source, /<Badge variant="success">\{badgeLabel\}<\/Badge>/)
  assert.doesNotMatch(source, /<Badge variant="secondary">\{badgeLabel\}<\/Badge>/)
  assert.match(source, /min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-y-contain p-4/)
  assert.match(source, /const STEP_DESC_TEXT_CLASSNAME = "text-sm leading-5 text-kumo-subtle \[\&_strong\]:font-semibold \[\&_strong\]:text-kumo-default"/)
  assert.match(source, /className=\{STEP_DESC_TEXT_CLASSNAME\}/)
  assert.match(source, /className=\{`space-y-2\.5 \$\{STEP_DESC_TEXT_CLASSNAME\}`\}/)
  assert.match(source, /<div className="space-y-2\.5">/)
  assert.match(source, /<div className="space-y-2 rounded-md bg-kumo-elevated px-2\.5 py-2">/)
  assert.match(source, /<div className="space-y-1">/)
  assert.match(source, /<Banner[\s\S]*?variant="alert"/)
  assert.match(source, /icon=\{[\s\S]*<Warning size=\{16\} weight="fill" \/>[\s\S]*\}/)
  assert.doesNotMatch(source, /className="!w-fit !max-w-full !p-4"/)
  assert.match(source, /<Text as="p" variant="body" size="sm" DANGEROUS_className="m-0 leading-5 !text-inherit \[\&_strong\]:font-semibold \[\&_strong\]:text-current">/)
  assert.match(source, /<SetupGuideAlertBanner html=\{t\("setup\.ios\.step4Warning"\)\} \/>/)
  assert.match(source, /<SetupGuideAlertBanner html=\{t\("setup\.android\.step4_1Tip"\)\} \/>/)
  assert.doesNotMatch(source, /className="space-y-2 text-xs leading-5 text-kumo-subtle \[\&_strong\]:font-semibold \[\&_strong\]:text-kumo-default"/)
  assert.doesNotMatch(source, /className="text-xs font-medium text-kumo-default"/)
  assert.match(source, /className="absolute top-2 right-2"/)
  assert.match(source, /onClick=\{onClose\}/)
  assert.doesNotMatch(source, /bg-black\/30/)
  assert.match(source, /setup\.ios\.step1/)
  assert.match(source, /setup\.ios\.step3\.action1/)
  assert.match(source, /ClipboardText/)
  assert.match(source, /<ClipboardText[\s\S]*?size="base"/)
  assert.match(source, /const resolvedUrl = url \|\| t\("url\.placeholder"\)/)
  assert.match(source, /className="w-3\/4 max-w-full"/)
  assert.match(source, /setup\.android\.step1/)
  assert.match(source, /dangerouslySetInnerHTML/)
  assert.doesNotMatch(source, /setup\.ios\.step4Desc/)
  assert.match(cssSource, /\.step-list-ul li \{[\s\S]*font-size: inherit;/)
  assert.match(cssSource, /\.step-list-ul li \{[\s\S]*margin-bottom: 0\.25rem;/)
  assert.match(cssSource, /\.step-list-ul li::before \{[\s\S]*color:\s*var\(--step-list-bullet-color,\s*var\(--color-kumo-brand\)\);/)
  assert.match(cssSource, /\[data-home-settings-setup-panel\]\s*\{[\s\S]*--step-list-bullet-color:\s*var\(--text-color-kumo-default\);/)
  assert.doesNotMatch(cssSource, /\.highlight-badge \{/)
  assert.match(i18nSource, /'setup\.android\.step4_1Tip':/)
  assert.doesNotMatch(i18nSource, /highlight-badge/)
})

test("Registry settings cards only expose business ID selector", () => {
  const paneSource = readSource("src/pages/registry/sections/workspace/HomeSettingsPane.jsx")
  const shellSource = readSource("src/pages/registry/sections/workspace/SettingsCardShell.jsx")

  assert.match(shellSource, /data-home-settings-card=\{cardId\}/)
  assert.match(shellSource, /compactAtDesktop = true/)
  assert.match(shellSource, /compactAtDesktop \? "md:min-h-0" : ""/)
  assert.doesNotMatch(shellSource, /data-home-settings-card-legacy/)
  assert.doesNotMatch(shellSource, /legacyCardId/)

  assert.match(paneSource, /compactAtDesktop=\{isDesktopShell\}/)
  assert.doesNotMatch(paneSource, /legacyId:/)
  assert.doesNotMatch(paneSource, /legacyCardId=/)
})


test("Registry settings URL block uses responsive row and flexible input", () => {
  const source = readSource("src/pages/registry/sections/workspace/cards/url-card.jsx")

  assert.match(source, /if \(config\.selectedType === "year"\)/)
  assert.match(source, /if \(config\.selectedType === "goal"\)/)
  assert.match(source, /className="min-w-0 w-full font-mono text-xs md:flex-1"/)
  assert.match(source, /className="min-w-0 w-full font-mono text-xs"/)
})

test("Registry goal config stays in goal-fields card with official range date picker and presets", () => {
  const goalSource = readSource("src/pages/registry/sections/workspace/cards/goal-fields-card.jsx")
  const rangeSource = readSource("src/pages/registry/sections/workspace/cards/goal-date-range-field.jsx")

  assert.match(goalSource, /t\("config\.goalName"\)/)
  assert.match(goalSource, /t\("config\.dateRange"\)/)
  assert.match(goalSource, /actions\.setGoalRange/)
  assert.match(goalSource, /config\.goalStartError/)
  assert.match(goalSource, /config\.goalDateError/)
  assert.match(rangeSource, /DatePicker/)
  assert.match(rangeSource, /mode="range"/)
  assert.match(rangeSource, /labelKey:\s*"preset\.range\.next30"/)
  assert.match(rangeSource, /labelKey:\s*"preset\.range\.next90"/)
  assert.match(rangeSource, /onChange/)
  assert.match(rangeSource, /today/)
  assert.match(rangeSource, /GOAL_START_MIN_ISO/)
  assert.match(rangeSource, /GOAL_TARGET_MAX_ISO/)
})

test("Goal date range field uses viewport-driven compact mode instead of layout measurement", () => {
  const source = readSource("src/pages/registry/sections/workspace/cards/goal-date-range-field.jsx")

  assert.match(source, /useEffect/)
  assert.match(source, /useState/)
  assert.match(source, /const GOAL_RANGE_COMPACT_BREAKPOINT_PX = 568/)
  assert.match(source, /const GOAL_RANGE_DAY_WIDTH_CSS = "var\(--rdp-day-width\)"/)
  assert.match(source, /const GOAL_RANGE_MONTHS_GAP_CSS = "var\(--rdp-months-gap\)"/)
  assert.match(source, /const GOAL_RANGE_POPOVER_PADDING_X_PX = 24/)
  assert.match(source, /const GOAL_RANGE_COMPACT_CALENDAR_WIDTH_CSS = `calc\(/)
  assert.match(source, /const GOAL_RANGE_COMPACT_POPOVER_WIDTH_CSS = `calc\(\$\{GOAL_RANGE_COMPACT_CALENDAR_WIDTH_CSS\} \+ \$\{GOAL_RANGE_POPOVER_PADDING_X_PX\}px\)`/)
  assert.match(source, /const GOAL_RANGE_WIDE_POPOVER_WIDTH_CSS = `calc\(\$\{GOAL_RANGE_COMPACT_CALENDAR_WIDTH_CSS\} \+ \$\{GOAL_RANGE_COMPACT_CALENDAR_WIDTH_CSS\} \+ \$\{GOAL_RANGE_MONTHS_GAP_CSS\} \+ \$\{GOAL_RANGE_POPOVER_PADDING_X_PX\}px\)`/)
  assert.match(source, /window\.matchMedia\(`\(max-width: \$\{GOAL_RANGE_COMPACT_BREAKPOINT_PX\}px\)`\)/)
  assert.match(source, /const \[isCompactViewport, setIsCompactViewport\] = useState/)
  assert.match(source, /const popoverWidth = isCompactViewport \? GOAL_RANGE_COMPACT_POPOVER_WIDTH_CSS : GOAL_RANGE_WIDE_POPOVER_WIDTH_CSS/)
  assert.match(source, /const datePickerStyles = isCompactViewport[\s\S]*root: \{ width: GOAL_RANGE_COMPACT_CALENDAR_WIDTH_CSS \}[\s\S]*months: \{[\s\S]*width: GOAL_RANGE_COMPACT_CALENDAR_WIDTH_CSS,[\s\S]*maxWidth: GOAL_RANGE_COMPACT_CALENDAR_WIDTH_CSS,[\s\S]*\}[\s\S]*: undefined/)
  assert.match(source, /<DatePicker[\s\S]*styles=\{datePickerStyles\}/)
  assert.match(source, /const visiblePresets = isCompactViewport \? PRESETS\.filter\(\(\{ id \}\) => id !== "next90"\) : PRESETS/)
  assert.match(source, /<Popover\.Content[\s\S]*align=\{isCompactViewport \? "center" : "start"\}/)
  assert.match(source, /style=\{\{ width: popoverWidth \}\}/)
  assert.match(source, /data-preset=\{preset\.id\}/)
  assert.match(source, /className="flex items-center gap-2"/)
  assert.match(source, /numberOfMonths=\{2\}/)
  assert.doesNotMatch(source, /ResizeObserver/)
  assert.doesNotMatch(source, /requestAnimationFrame/)
  assert.doesNotMatch(source, /querySelector\("\.rdp-months"\)/)
  assert.doesNotMatch(source, /querySelectorAll\("\.rdp-month"\)/)
  assert.doesNotMatch(source, /@container/)
})

test("Goal date range field vendors restartable DatePicker flow without mutating trigger label draft", () => {
  const kumoSource = readSource("src/components/ui/kumo.jsx")
  const rangeSource = readSource("src/pages/registry/sections/workspace/cards/goal-date-range-field.jsx")

  assert.match(kumoSource, /DatePicker/)
  assert.doesNotMatch(kumoSource, /DatePicker,\s*[\s\S]*from "@cloudflare\/kumo"/)
  assert.match(kumoSource, /from "@\/components\/ui\/vendor\/kumo-date-picker"/)

  assertNamedImports(rangeSource, "@/components/ui/popover", ["Popover"])
  assert.match(rangeSource, /const \[open, setOpen\] = useState\(false\)/)
  assert.match(rangeSource, /const \[draftRange, setDraftRange\] = useState\(undefined\)/)
  assert.match(rangeSource, /open=\{open\}/)
  assert.match(rangeSource, /onOpenChange=\{handleOpenChange\}/)
  assert.match(rangeSource, /selected=\{draftRange\}/)
  assert.match(rangeSource, /onChange=\{handleDraftRangeChange\}/)
  assert.match(rangeSource, /rangeSelectionBehavior="restart"/)
  assert.match(rangeSource, /onRangeComplete=\{handleRangeComplete\}/)
  assert.match(rangeSource, /function getRangeLabel\(\{ startISO, endISO, t \}\)/)
  assert.match(rangeSource, /<span className="truncate text-sm">\{getRangeLabel\(\{ startISO, endISO, t \}\)\}<\/span>/)
  assert.match(rangeSource, /handleRangeComplete = \(range\) =>/)
  assert.match(rangeSource, /onChange\(\{\s*startISO: toISODate\(range\.from\),\s*endISO: toISODate\(range\.to\),?\s*\}\)/)
  assert.match(rangeSource, /setOpen\(false\)/)
  assert.match(rangeSource, /handlePresetSelect = \(days\) =>/)
  assert.match(rangeSource, /onChange\(\{\s*startISO: toISODate\(today\),\s*endISO: toISODate\(nextDate\),?\s*\}\)/)
})

test("Legacy settings fallback is fully removed from HomeSettingsPane", () => {
  const source = readSource("src/pages/registry/sections/workspace/HomeSettingsPane.jsx")

  assert.doesNotMatch(source, /function shouldShowLegacySettings\(/)
  assert.doesNotMatch(source, /function LegacySettingsForm\(/)
  assert.doesNotMatch(source, /data-home-settings-legacy/)
  assert.doesNotMatch(source, /legacySettings=1/)
})

test("Registry menu accessibility labels are present in i18n", () => {
  const source = readSource("src/data/i18n.js")

  assert.match(source, /'registry\.menu\.open'/)
  assert.match(source, /'registry\.menu\.close'/)
  assert.match(source, /'registry\.sidebar\.toggle'/)
})

test("HomeGrid provides split workspace layout", () => {
  const source = readSource("src/pages/registry/sections/components/HomeGrid.jsx")

  assert.match(source, /const AUTOFLOW_INTERVAL_MS = 500/)
  assert.match(source, /const AUTOFLOW_STORAGE_KEY = "registry\.settingsAutoflow\.v1"/)
  assert.match(source, /function HomeGrid\(\{\s*selectedStyle,\s*forceOnboarding = false,\s*effectiveLayoutTier = "lg",\s*sidebarOpen = false,?\s*\}\)/)
  assert.match(source, /const isDesktopShell = shouldUseDesktopWorkspaceShell\(\{ effectiveLayoutTier, sidebarOpen \}\)/)
  assert.match(source, /const useSegmentedWorkspaceLayout = shouldUseSegmentedWorkspace\(\{ effectiveLayoutTier, sidebarOpen \}\)/)
  assert.match(source, /const paneEffectiveLayoutTier = effectiveLayoutTier === "md" && !sidebarOpen \? "mid" : effectiveLayoutTier/)
  assert.match(source, /const segmentedWorkspaceLayoutClassName = effectiveLayoutTier === "mobile"/)
  assert.match(source, /const workspaceLayoutClassName = useSegmentedWorkspaceLayout/)
  assert.match(source, /\? "h-full grid-rows-\[auto_minmax\(0,1fr\)\] overflow-y-hidden"/)
  assert.match(source, /: "md:h-\[calc\(100vh-var\(--registry-topbar-height\)\)\] md:grid-rows-\[auto_minmax\(0,1fr\)\] md:overflow-hidden"/)
  assert.match(source, /: isDesktopShell/)
  assert.match(source, /\? "md:h-full md:grid-cols-2 md:divide-x md:divide-kumo-line md:overflow-hidden"/)
  assert.match(source, /: "overflow-y-auto overscroll-y-contain md:h-auto md:overflow-y-visible md:overscroll-y-auto"/)
  assert.match(source, /const guideHostClassName = \[/)
  assert.match(source, /sidebarOpen\s*\?\s*"left-\[calc\(var\(--registry-rail-width\)\+var\(--registry-sidebar-panel-width\)\)\]"\s*:\s*"left-\[var\(--registry-rail-width\)\]"/)
  assert.match(source, /const shouldRenderMobileGuideHost = effectiveLayoutTier === "mobile"/)
  assert.match(source, /localStorage\.getItem\(AUTOFLOW_STORAGE_KEY\)/)
  assert.match(source, /localStorage\.setItem\(AUTOFLOW_STORAGE_KEY,\s*"1"\)/)
  assert.match(source, /if \(forceOnboarding\) return/)
  assert.match(source, /const shouldSkipAutoflow = hasSeenAutoflow && !forceOnboarding/)
  assert.match(source, /const \[revealStage, setRevealStage\] = useState\(0\)/)
  assert.match(source, /const \[hasSeenAutoflow, setHasSeenAutoflow\] = useState\(\(\) => \{/)
  assert.match(source, /const handleRevealAll = useCallback\(\(\) => \{/)
  assert.match(source, /onRequestRevealAll=\{handleRevealAll\}/)
  assert.match(source, /data-registry-workspace/)
  assert.doesNotMatch(source, /grid-cols-1 overflow-x-hidden overflow-y-auto overscroll-y-contain md:h-auto md:overflow-y-visible md:overscroll-y-auto bg-kumo-elevated/)
  assert.match(source, /data-registry-pane=["']preview["']/)
  assert.match(source, /data-registry-pane=["']settings["']/)
  assert.match(source, /<div\s+className=\{guideHostClassName\}>/)
  assert.match(source, /className="pointer-events-none absolute inset-0 z-40 md:hidden"/)
  assert.match(source, /<HomeSettingsPane[\s\S]*?revealStage=\{revealStage\}/)
  assert.match(source, /<HomeSettingsPane[\s\S]*?effectiveLayoutTier=\{paneEffectiveLayoutTier\}/)
  assert.match(source, /<HomeSettingsPane[\s\S]*?useSegmentedWorkspaceLayout=\{useSegmentedWorkspaceLayout\}/)
  assert.doesNotMatch(source, /vendor\/kumo\/packages\/kumo-docs-astro\/src\/components\/demos\/HomeGrid/)
})

test("HomePage keeps md drawer-open height chain untouched outside active tabs mode", () => {
  const source = readSource("src/pages/registry/HomePage.jsx")

  assert.doesNotMatch(source, /const useSegmentedWorkspaceLayout =/)
  assert.doesNotMatch(source, /useMdBottomTabsLayout \? "md:overflow-y-hidden" : ""/)
  assert.doesNotMatch(source, /useMdBottomTabsLayout \? "md:h-full" : ""/)
})

test("HomeSettingsPane supports mid tier as desktop shell single-column equal rows", () => {
  const source = readSource("src/pages/registry/sections/workspace/HomeSettingsPane.jsx")

  assert.match(source, /const isMid = effectiveLayoutTier === "mid"/)
  assert.match(source, /const isLg = effectiveLayoutTier === "lg"/)
  assert.match(source, /const isDesktopShell = isMid \|\| isLg/)
  assert.match(source, /const rowCount = resolveMidRowCount\(config\.selectedType\)/)
  assert.match(source, /const gridInlineStyle = isMid \? \{ gridTemplateRows: `repeat\(\$\{rowCount\}, minmax\(0, 1fr\)\)` \} : undefined/)
  assert.match(source, /isMid \? "md:grid-cols-1" : "md:grid-cols-2"/)
  assert.match(source, /style=\{gridInlineStyle\}/)
  assert.doesNotMatch(source, /settingsLayoutTier/)
})

test("HomePreviewPane keeps select-type hint before style selection", () => {
  const source = readSource("src/pages/registry/sections/workspace/HomePreviewPane.jsx")

  assert.match(source, /function HomePreviewPane\(\{\s*config,\s*selectedDevice,\s*t\s*\}\)/)
  assert.match(source, /preview\.selectType/)
  assert.doesNotMatch(source, /SkeletonLine/)
})

test("HomePreviewPane scales all wallpaper previews from base device coordinates", () => {
  const source = readSource("src/pages/registry/sections/workspace/HomePreviewPane.jsx")

  assert.match(
    source,
    /const SCREEN_WIDTH = LOCK_SCREEN_LAYOUT\.wallpaper\.width \* LOCK_SCREEN_LAYOUT\.scale/
  )
  assert.match(source, /const SCREEN_HEIGHT = LOCK_SCREEN_LAYOUT\.targetHeight/)
  assert.match(source, /const previewScale = Math\.max\(SCREEN_WIDTH \/ baseWidth,\s*SCREEN_HEIGHT \/ baseHeight\)/)
  assert.match(source, /const previewWidth = baseWidth \* previewScale/)
  assert.match(source, /const previewHeight = baseHeight \* previewScale/)
  assert.match(source, /const rendererByType = \{/)
  assert.match(source, /year:\s*drawYearProgress/)
  assert.match(source, /life:\s*drawLifeCalendar/)
  assert.match(source, /goal:\s*drawGoalCountdown/)
  assert.match(source, /const drawWallpaperPreview = rendererByType\[config\.selectedType\]/)
  assert.match(source, /ctx\.save\(\)/)
  assert.match(source, /ctx\.scale\(previewScale,\s*previewScale\)/)
  assert.match(source, /drawWallpaperPreview\(ctx,\s*baseWidth,\s*baseHeight,\s*renderConfig,\s*selectedDevice\.clockHeight\)/)
  assert.match(source, /ctx\.restore\(\)/)
  assert.doesNotMatch(source, /const scaleX = width \/ baseWidth/)
  assert.doesNotMatch(source, /const scaleY = height \/ baseHeight/)
  assert.doesNotMatch(source, /drawYearProgress\(ctx,\s*width,\s*height,\s*renderConfig,\s*selectedDevice\.clockHeight\)/)
  assert.doesNotMatch(source, /drawLifeCalendar\(ctx,\s*width,\s*height,\s*renderConfig,\s*selectedDevice\.clockHeight\)/)
  assert.doesNotMatch(source, /drawGoalCountdown\(ctx,\s*width,\s*height,\s*renderConfig,\s*selectedDevice\.clockHeight\)/)
})

test("HomePreviewPane delegates lock screen chrome to LockScreenPreviewFrame", () => {
  const source = readSource("src/pages/registry/sections/workspace/HomePreviewPane.jsx")

  assertNamedImports(source, "./LockScreenPreviewFrame", ["LockScreenPreviewFrame", "LOCK_SCREEN_LAYOUT"])
  assert.match(source, /<LockScreenPreviewFrame[\s\S]*?showOverlay=\{Boolean\(config\.selectedType\)\}[\s\S]*?>/)
  assert.match(source, /aria-label="Wallpaper live preview canvas"/)
  assert.doesNotMatch(source, /rounded-\[40px\]/)
  assert.doesNotMatch(source, /top-\[10px\]/)
})

test("LockScreenPreviewFrame derives shell scale from Figma wallpaper metrics", () => {
  const source = readSource("src/pages/registry/sections/workspace/LockScreenPreviewFrame.jsx")

  assert.match(source, /const LOCK_SCREEN_LAYOUT =/)
  assert.match(source, /const BEZEL_INSET = 1/)
  assertNamedImports(source, "./lock-screen-overlay", [
    "LockScreenOverlay",
    "LOCK_SCREEN_OVERLAY_DEFAULT_COLORS",
    "LOCK_SCREEN_OVERLAY_LAYER_IDS",
  ])
  assert.match(
    source,
    /function LockScreenPreviewFrame\(\{\s*children,\s*showOverlay = true,\s*overlayColors\s*\}\)/
  )
  assert.match(source, /shell:\s*\{\s*width:\s*450,\s*height:\s*920\s*\}/)
  assert.match(source, /wallpaper:\s*\{\s*width:\s*402,\s*height:\s*874,\s*left:\s*24,\s*top:\s*23\s*\}/)
  assert.match(source, /targetHeight:\s*510/)
  assert.match(source, /scale:\s*510\s*\/\s*874/)
  assert.match(source, /width:\s*`\$\{scaledWallpaperWidth\}px`/)
  assert.match(source, /height:\s*`\$\{scaledWallpaperHeight\}px`/)
  assert.match(source, /const bezelScale = \(scaledShellWidth - BEZEL_INSET \* 2\) \/ scaledShellWidth/)
  assert.match(source, /left:\s*`\$\{scaledBezelLeft\}px`/)
  assert.match(source, /top:\s*`\$\{scaledBezelTop\}px`/)
  assert.match(source, /width:\s*`\$\{scaledBezelWidth\}px`/)
  assert.match(source, /height:\s*`\$\{scaledBezelHeight\}px`/)
  assert.match(source, /showOverlay \? \(/)
  assert.match(source, /<LockScreenOverlay[\s\S]*?colors=\{overlayColors\}/)
  assert.match(source, /"\/preview\/iPhone\/lock-screen-bezel\.svg"/)
  assert.match(source, /export \{[\s\S]*?LOCK_SCREEN_OVERLAY_DEFAULT_COLORS[\s\S]*?\}/)
  assert.match(source, /export \{[\s\S]*?LOCK_SCREEN_OVERLAY_LAYER_IDS[\s\S]*?\}/)
  assert.doesNotMatch(source, /lock-screen-dark-overlay\.svg/)
  assert.doesNotMatch(source, /<img[\s\S]*?overlay/)
})

test("Lock screen overlay exports stable layer ids and default colors", () => {
  const source = readSource("src/pages/registry/sections/workspace/lock-screen-overlay/index.js")
  const constantsSource = readSource(
    "src/pages/registry/sections/workspace/lock-screen-overlay/lock-screen-overlay.constants.js"
  )
  const componentSource = readSource(
    "src/pages/registry/sections/workspace/lock-screen-overlay/LockScreenOverlay.jsx"
  )
  const symbolsSource = readSource(
    "src/pages/registry/sections/workspace/lock-screen-overlay/lock-screen-overlay.symbols.js"
  )
  const runtimeSource = readSource(
    "src/pages/registry/sections/workspace/lock-screen-overlay/lock-screen-overlay.runtime.js"
  )

  assert.match(source, /export \{ LockScreenOverlay \} from "\.\/LockScreenOverlay"/)
  assert.match(
    source,
    /export \{[\s\S]*?LOCK_SCREEN_OVERLAY_DEFAULT_COLORS[\s\S]*?LOCK_SCREEN_OVERLAY_LAYER_IDS[\s\S]*?\} from "\.\/lock-screen-overlay.constants"/
  )
  assert.match(constantsSource, /const LOCK_SCREEN_OVERLAY_LAYER_IDS = \[/)
  assert.match(constantsSource, /"home-indicator"/)
  assert.match(constantsSource, /"action-left-bg"/)
  assert.match(constantsSource, /"action-left-icon"/)
  assert.match(constantsSource, /"action-right-bg"/)
  assert.match(constantsSource, /"action-right-icon"/)
  assert.match(constantsSource, /"widgets-complication-1-bg"/)
  assert.match(constantsSource, /"widgets-complication-4-fg"/)
  assert.match(constantsSource, /"swipe-indicator"/)
  assert.match(constantsSource, /"date-text"/)
  assert.match(constantsSource, /"time-shape"/)
  assert.match(constantsSource, /"status-bar-leading"/)
  assert.match(constantsSource, /"status-bar-trailing"/)
  assert.match(constantsSource, /"battery"/)
  assert.match(constantsSource, /"wifi"/)
  assert.match(constantsSource, /"cellular"/)
  assert.match(constantsSource, /const LOCK_SCREEN_OVERLAY_DEFAULT_COLORS = \{/)
  assert.match(constantsSource, /const WIDGET_FOREGROUND_COLOR = "var\(--text-color-kumo-inverse\)"/)
  assert.match(
    constantsSource,
    /const WIDGET_BACKGROUND_COLOR = "color-mix\(in srgb, var\(--text-color-kumo-inverse\) 15%, transparent\)"/
  )
  assert.match(constantsSource, /"home-indicator":/)
  assert.match(constantsSource, /"widgets-complication-1-bg":\s*WIDGET_BACKGROUND_COLOR/)
  assert.match(constantsSource, /"widgets-complication-1-fg":\s*WIDGET_FOREGROUND_COLOR/)
  assert.match(constantsSource, /"widgets-complication-4-bg":\s*WIDGET_BACKGROUND_COLOR/)
  assert.match(constantsSource, /"widgets-complication-4-fg":\s*WIDGET_FOREGROUND_COLOR/)
  assert.match(componentSource, /function LockScreenOverlay\(\{\s*className,\s*colors\s*=\s*\{\},\s*style\s*\}\)/)
  assert.match(componentSource, /data-lock-screen-overlay="lock-screen"/)
  assert.match(componentSource, /viewBox="0 0 402 874"/)
  assert.match(componentSource, /data-overlay-layer="home-indicator"/)
  assert.match(componentSource, /data-overlay-layer="home-indicator"[\s\S]*?transform="translate\(0 830\)"/)
  assert.doesNotMatch(componentSource, /data-overlay-layer="dynamic-island"/)
  assert.doesNotMatch(constantsSource, /"dynamic-island"/)
  assert.match(componentSource, /data-overlay-layer="widgets-complication-1-fg"/)
  assert.match(componentSource, /lock-screen-controls\.svg/)
  assert.match(componentSource, /<image[\s\S]*?href=\{LOCK_SCREEN_CONTROLS_ASSET_SRC\}/)
  assert.match(componentSource, /transform="translate\(30 679\)"/)
  assert.match(componentSource, /transform="translate\(0 766\)"/)
  assert.match(componentSource, /transform="translate\(18 19\)"/)
  assert.match(componentSource, /data-overlay-layer="time-shape"/)
  assert.match(componentSource, /useEffect/)
  assert.match(componentSource, /useState/)
  assert.match(componentSource, /formatLockScreenDate/)
  assert.match(componentSource, /formatLockScreenTime24/)
  assert.match(componentSource, /resolveLockScreenEnglishFontFamily/)
  assert.match(componentSource, /getMsUntilNextMinute/)
  assert.match(componentSource, /const overlayTextFontFamily = englishFontFamily/)
  assert.doesNotMatch(componentSource, /overlaySymbolFontFamily/)
  assert.match(
    componentSource,
    /from "\.\/lock-screen-overlay\.symbols"/
  )
  assert.match(componentSource, /x="201"/)
  assert.match(componentSource, /fontSize="22"/)
  assert.match(componentSource, /fontWeight="500"/)
  assert.match(componentSource, /textAnchor="middle"/)
  assert.match(componentSource, /fontSize="120"/)
  assert.doesNotMatch(componentSource, />\s*Tue April 1\s*</)
  assert.doesNotMatch(componentSource, />\s*9:41\s*</)
  assert.doesNotMatch(componentSource, /data-overlay-layer="widgets-complication-1-fg"[\s\S]*?>\s*72\s*</)
  assert.doesNotMatch(componentSource, /data-overlay-layer="widgets-complication-1-fg"[\s\S]*?>\s*52\s*</)
  assert.doesNotMatch(componentSource, /data-overlay-layer="widgets-complication-1-fg"[\s\S]*?>\s*89\s*</)
  assert.doesNotMatch(componentSource, /M97\.0585938,115\.464844/)
  assert.match(symbolsSource, /const APPLE_WATCH_SYMBOL_PATH =/)
  assert.match(symbolsSource, /const SUN_HORIZON_FILL_TOP_PATH =/)
  assert.match(symbolsSource, /const SUN_HORIZON_FILL_BOTTOM_PATH =/)
  assert.match(symbolsSource, /const UMBRELLA_FILL_PATH =/)
  assert.match(symbolsSource, /export \{/)
  assert.match(componentSource, /d=\{APPLE_WATCH_SYMBOL_PATH\}/)
  assert.match(componentSource, /d=\{SUN_HORIZON_FILL_TOP_PATH\}/)
  assert.match(componentSource, /d=\{UMBRELLA_FILL_PATH\}/)
  assert.doesNotMatch(componentSource, /􀿫/)
  assert.doesNotMatch(componentSource, /􀆴/)
  assert.doesNotMatch(componentSource, /􀙖/)
  assert.doesNotMatch(componentSource, /APPLE_WATCH_SYMBOL_SCALE/)
  assert.doesNotMatch(componentSource, /APPLE_WATCH_SYMBOL_TRANSLATE_X/)
  assert.doesNotMatch(componentSource, /APPLE_WATCH_SYMBOL_TRANSLATE_Y/)
  assert.match(componentSource, /transform="translate\(27\.16404 23\.45508\) scale\(1\.2\)"/)
  assert.match(componentSource, /transform="translate\(27\.415 12\.242\) scale\(0\.6861\)"/)
  assert.match(componentSource, /transform="translate\(28\.572 46\.433\) scale\(0\.797\)"/)
  assert.equal((componentSource.match(/fontFamily="SF Pro"/g) ?? []).length, 0)
  assert.equal((componentSource.match(/fontFamily=\{overlaySymbolFontFamily\}/g) ?? []).length, 0)
  assert.ok((componentSource.match(/fontFamily=\{overlayTextFontFamily\}/g) ?? []).length >= 6)
  assert.match(componentSource, /style=\{\s*resolveLayerStyle\(/)
  assert.match(runtimeSource, /function formatLockScreenDate/)
  assert.match(runtimeSource, /function formatLockScreenTime24/)
  assert.match(runtimeSource, /function isAppleRuntimePlatform/)
  assert.match(runtimeSource, /function resolveLockScreenEnglishFontFamily/)
  assert.match(runtimeSource, /function getMsUntilNextMinute/)
})

test("Home preview maps accent and background colors into lock screen overlay", () => {
  const previewSource = readSource("src/pages/registry/sections/workspace/HomePreviewPane.jsx")
  const frameSource = readSource("src/pages/registry/sections/workspace/LockScreenPreviewFrame.jsx")
  const helperSource = readSource(
    "src/pages/registry/sections/workspace/lock-screen-overlay/lock-screen-overlay.colors.js"
  )

  assert.match(
    previewSource,
    /import \{[\s\S]*?createLockScreenAccentOverlayColors,[\s\S]*?createLockScreenTopOverlayColors,[\s\S]*?\} from "\.\/lock-screen-overlay\/lock-screen-overlay\.colors"/
  )
  assert.match(
    previewSource,
    /const overlayColors = \{\s*\.\.\.createLockScreenTopOverlayColors\(config\.bgColor\),\s*\.\.\.createLockScreenAccentOverlayColors\(config\.accentColor\),\s*\}/
  )
  assert.match(previewSource, /<LockScreenPreviewFrame[\s\S]*?overlayColors=\{overlayColors\}/)

  assert.match(helperSource, /function createLockScreenAccentOverlayColors\(accentColor\)/)
  assert.match(helperSource, /function createLockScreenTopOverlayColors\(bgColor\)/)
  assert.match(helperSource, /function resolveSwipeIndicatorColor\(bgColor\)/)
  assert.match(helperSource, /"time-shape":\s*accentColor/)
  assert.match(helperSource, /"date-text":\s*accentColor/)
  assert.match(helperSource, /"widgets-complication-1-fg":\s*accentColor/)
  assert.match(helperSource, /"widgets-complication-4-fg":\s*accentColor/)
  assert.match(helperSource, /"widgets-complication-1-bg":\s*resolveAccentAlpha\(accentColor,\s*0\.15\)/)
  assert.match(helperSource, /"widgets-complication-4-bg":\s*resolveAccentAlpha\(accentColor,\s*0\.15\)/)
  assert.match(helperSource, /getContrastBase\(bgColor\)/)
  assert.match(helperSource, /"home-indicator":\s*topColor/)
  assert.match(helperSource, /"status-bar-leading":\s*topColor/)
  assert.match(helperSource, /"status-bar-trailing":\s*topColor/)
  assert.match(helperSource, /battery:\s*topColor/)
  assert.match(helperSource, /wifi:\s*topColor/)
  assert.match(helperSource, /cellular:\s*topColor/)
  assert.match(helperSource, /const swipeIndicatorColor = resolveSwipeIndicatorColor\(bgColor\)/)
  assert.match(helperSource, /"swipe-indicator":\s*swipeIndicatorColor/)
  assert.doesNotMatch(helperSource, /"status-bar-leading":\s*accentColor/)

  assert.match(frameSource, /function LockScreenPreviewFrame\(\{\s*children,\s*showOverlay = true,\s*overlayColors\s*\}\)/)
  assert.match(frameSource, /colors=\{overlayColors\}/)
})

test("Public preview keeps only bezel shell asset at runtime", () => {
  assert.ok(
    fs.existsSync(path.join(process.cwd(), "public/preview/iPhone/lock-screen-bezel.svg")),
    "lock screen bezel asset missing"
  )
  assert.ok(
    fs.existsSync(path.join(process.cwd(), "public/preview/iPhone/lock-screen-controls.svg")),
    "lock screen controls asset missing"
  )
  assert.equal(
    fs.existsSync(path.join(process.cwd(), "public/preview/iPhone/lock-screen-overlay.svg")),
    false
  )
})

test("HomeSettingsPane uses six-slot skeleton base and stage-based reveal", () => {
  const source = readSource("src/pages/registry/sections/workspace/HomeSettingsPane.jsx")

  assertNamedImports(source, "@/components/ui/kumo", ["SkeletonLine"])
  assert.match(source, /const SETTINGS_SLOT_MARKS = \["➊", "➋", "➌", "➍", "➎", "➏"\]/)
  assert.match(source, /const MID_SKELETON_ROW_COUNT = MD_BOTTOM_TABS_SLOT_COUNT/)
  assert.match(source, /function SettingsCardTitleSkeleton\(\)/)
  assert.match(source, /\{!config\.selectedType/)
  assert.match(source, /title={<SettingsCardTitleSkeleton \/>}/)
  assert.match(source, /const title = isUnlocked \? resolvedTitle : <SettingsCardTitleSkeleton \/>/)
  assert.match(source, /const titleTooltip = isUnlocked \? resolvedTitleTooltip : undefined/)
  assert.match(source, /const unlockedCount = Math\.min\(cardOrder\.length, Math\.max\(0, revealStage\)\)/)
  assert.match(source, /onRequestRevealAll/)
  assert.match(source, /<SkeletonLine/)
  assert.doesNotMatch(source, /SettingsTabLabelSkeleton/)
})

test("Kumo UI export includes SkeletonLine and Tabs for page-level placeholders and navigation", () => {
  const source = readSource("src/components/ui/kumo.jsx")
  assert.match(source, /SkeletonLine/)
  assert.match(source, /\bTabs\b/)
})

test("No unsupported Text variants are used in src", () => {
  const sourceFiles = listFiles("src").filter((file) => file.endsWith(".jsx"))
  const offenders = sourceFiles.filter((file) => /\bvariant=["']heading4["']/.test(readSource(file)))

  assert.equal(
    offenders.length,
    0,
    `Unsupported Text variant heading4 used in: ${offenders.join(", ")}`
  )
})

test("Lucide icons are fully removed from src", () => {
  const sourceFiles = listFiles("src").filter((file) => file.endsWith(".jsx"))
  const offenders = sourceFiles.filter((file) => readSource(file).includes("lucide-react"))

  assert.equal(
    offenders.length,
    0,
    `lucide-react still used in: ${offenders.join(", ")}`
  )
})

test("react-icons is fully removed from src", () => {
  const sourceFiles = listFiles("src").filter((file) => file.endsWith(".jsx"))
  const offenders = sourceFiles.filter((file) => readSource(file).includes("react-icons"))

  assert.equal(
    offenders.length,
    0,
    `react-icons still used in: ${offenders.join(", ")}`
  )
})

test("Neumorphic variables are fully removed from src", () => {
  const sourceFiles = listFiles("src").filter((file) => file.endsWith(".jsx") || file.endsWith(".css"))
  const offenders = sourceFiles.filter((file) => readSource(file).includes("--neumorphic-"))

  assert.equal(
    offenders.length,
    0,
    `--neumorphic-* still used in: ${offenders.join(", ")}`
  )
})
