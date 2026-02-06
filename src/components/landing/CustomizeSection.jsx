/**
 * [INPUT]: 依赖 @/components/ui/*, @/data/countries, @/data/devices, @/lib/renderer, @/lib/I18nContext, @internationalized/date, shared/palettes, shared/wallpaper-core
 * [OUTPUT]: Customize Section 组件 (预览 + 配置面板，使用 JollyUI DatePicker)
 * [POS]: Landing Page 第三部分，用户配置壁纸参数，**透传设备级 cols/padding 参数**
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { useState, useEffect, useRef, useCallback } from "react"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup,
    SelectLabel,
} from "@/components/ui/select"
import { JollyDatePicker, DatePicker, DatePickerContent } from "@/components/ui/date-picker"
import { DateInput } from "@/components/ui/datefield"
import { Calendar, CalendarCell, CalendarGrid, CalendarGridBody, CalendarGridHeader, CalendarHeaderCell, CalendarHeading, MonthYearPicker } from "@/components/ui/calendar"
import { FieldGroup } from "@/components/ui/field"
import { parseDate } from "@internationalized/date"
import { CalendarIcon } from "lucide-react"
import { ColorPicker } from "@/components/ui/color-picker"
import { countries, getTimezone } from "@/data/countries"
import { devices, getDevice } from "@/data/devices"
import { drawYearProgress, drawLifeCalendar, drawGoalCountdown } from "@/lib/renderer"
import { getSafeAccent } from "../../../shared/wallpaper-core"
import { DEFAULT_PALETTE, PALETTE_PRESETS } from "../../../shared/palettes"
import { useI18n } from "@/lib/I18nContext"
import { cn } from "@/lib/utils"

/* ========================================================================
   Device Frame Component (260x530 原版尺寸)
   ======================================================================== */

function DeviceFrame({ children }) {
    return (
        <div
            className="relative bg-muted rounded-[40px] p-[10px]"
            style={{
                width: '260px',
                height: '530px',
                boxShadow: 'var(--neumorphic-elevated), var(--neumorphic-highlight)'
            }}
        >
            {/* Notch */}
            <div className="absolute top-[10px] left-1/2 -translate-x-1/2 w-[100px] h-[28px] bg-foreground rounded-b-2xl z-10" />
            {/* Screen */}
            <div className="w-full h-full bg-background rounded-[32px] overflow-hidden flex items-center justify-center">
                {children}
            </div>
            {/* Home Indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[100px] h-1 bg-foreground/30 rounded-full" />
        </div>
    )
}

/* ========================================================================
   Canvas Preview Component (高清渲染)
   ======================================================================== */

function CanvasPreview({ config }) {
    const canvasRef = useRef(null)
    const { t } = useI18n()

    const drawPreview = useCallback(() => {
        const canvas = canvasRef.current
        if (!canvas || !config.selectedType) return

        const ctx = canvas.getContext('2d')

        // 根据选中的设备获取尺寸
        const device = getDevice(config.device) || devices[0]; // 默认 iPhone 17 Pro Max
        const baseWidth = device.width;
        const baseHeight = device.height;
        const clockHeight = device.clockHeight;
        const scale = 0.8;

        const width = baseWidth * scale;
        const height = baseHeight * scale;

        // 高 DPI 支持
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = '100%';
        canvas.style.height = '100%';

        ctx.scale(dpr, dpr);

        // 背景
        ctx.fillStyle = config.bgColor;
        ctx.fillRect(0, 0, width, height);

        // 合并设备级参数到 config
        const renderConfig = {
            ...config,
            cols: device.cols,
            padding: device.padding
        };

        if (config.selectedType === 'year') {
            drawYearProgress(ctx, width, height, renderConfig, clockHeight);
        } else if (config.selectedType === 'life') {
            drawLifeCalendar(ctx, width, height, renderConfig, clockHeight);
        } else if (config.selectedType === 'goal') {
            drawGoalCountdown(ctx, width, height, renderConfig, clockHeight);
        }
    }, [config])

    useEffect(() => {
        drawPreview()
    }, [drawPreview])

    if (!config.selectedType) {
        return (
            <div className="text-muted-foreground text-sm text-center">
                {t('preview.selectType')}
            </div>
        )
    }

    return (
        <canvas
            ref={canvasRef}
            className="rounded-2xl"
            style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '24px'
            }}
        />
    )
}

/* ========================================================================
   Color Preset Button - 明显的边框背景区分
   ======================================================================== */

function ColorPreset({ bg, accent, onClick, disabled }) {
    return (
        <Button
            variant="outline"
            size="icon"
            className="flex gap-1 p-2 w-auto h-auto rounded-xl border-border/40"
            onClick={() => onClick(bg, accent)}
            disabled={disabled}
        >
            <span className="w-5 h-5 rounded-md border border-border/30" style={{ background: bg }} />
            <span className="w-5 h-5 rounded-md border border-border/30" style={{ background: accent }} />
        </Button>
    )
}

/* ========================================================================
   Main Component
   ======================================================================== */

export function CustomizeSection({ selectedType }) {
    const { t, lang } = useI18n()
    const defaultPalette = DEFAULT_PALETTE
    const defaultAccent = getSafeAccent(defaultPalette.bg, defaultPalette.accent)
    const [config, setConfig] = useState(() => ({
        selectedType: selectedType || null,
        country: '',
        timezone: '',
        wallpaperLang: 'en',
        bgColor: defaultPalette.bg,
        accentColor: defaultAccent,
        originalAccentColor: defaultPalette.accent, // 用户原始选择的强调色
        dob: '',
        lifespan: 80,
        goalName: '',
        goalDate: '',
        device: 'iPhone 17 Pro Max',
    }))
    const [copied, setCopied] = useState(false)

    // 同步壁纸语言与 UI 语言 (用户未手动修改时)
    const [userChangedWallpaperLang, setUserChangedWallpaperLang] = useState(false)
    useEffect(() => {
        if (!userChangedWallpaperLang) {
            setConfig(prev => ({ ...prev, wallpaperLang: lang }))
        }
    }, [lang, userChangedWallpaperLang])

    useEffect(() => {
        setConfig(prev => ({ ...prev, selectedType }))
    }, [selectedType])

    // 自动探测国家/时区
    const getFlagEmoji = (code) => {
        const codePoints = code.toUpperCase().split('').map(c => 127397 + c.charCodeAt());
        return String.fromCodePoint(...codePoints);
    }

    useEffect(() => {
        try {
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const country = countries.find(c => c.timezone === tz);
            if (country) {
                setConfig(prev => ({
                    ...prev,
                    country: country.code,
                    timezone: country.timezone
                }))
            } else if (tz) {
                setConfig(prev => ({
                    ...prev,
                    timezone: tz
                }))
            }
        } catch (e) {
            console.warn("Auto-detect country failed", e);
        }
    }, [])

    const updateConfig = (key, value) => {
        if (key === 'wallpaperLang') {
            setUserChangedWallpaperLang(true)
        }

        setConfig(prev => {
            const next = { ...prev, [key]: value };

            if (key === 'country') {
                next.timezone = getTimezone(value);
            }

            // 如果修改了背景色或强调色，需要同步安全色
            if (key === 'bgColor' || key === 'originalAccentColor') {
                const safeAccent = getSafeAccent(next.bgColor, next.originalAccentColor);
                next.accentColor = safeAccent;
            }

            return next;
        })
    }

    const applyPreset = (bg, accent) => {
        setConfig(prev => ({
            ...prev,
            bgColor: bg,
            originalAccentColor: accent,
            accentColor: getSafeAccent(bg, accent)
        }))
    }

    // 选中的设备信息
    const selectedDevice = getDevice(config.device) || devices[4];

    const generateURL = () => {
        if (!config.selectedType) return ''
        const params = new URLSearchParams()
        params.set('type', config.selectedType)
        params.set('bg', config.bgColor.replace('#', ''))
        params.set('accent', config.accentColor.replace('#', ''))
        params.set('width', selectedDevice.width.toString())
        params.set('height', selectedDevice.height.toString())
        params.set('clockHeight', selectedDevice.clockHeight.toString())
        params.set('lang', config.wallpaperLang)
        if (selectedDevice.cols) params.set('cols', selectedDevice.cols.toString())
        if (selectedDevice.padding) params.set('padding', selectedDevice.padding.toString())
        if (config.country) params.set('country', config.country)
        if (config.timezone) params.set('tz', config.timezone)
        if (config.selectedType === 'life' && config.dob) {
            params.set('dob', config.dob)
            params.set('lifespan', config.lifespan.toString())
        }
        if (config.selectedType === 'goal') {
            if (config.goalName) params.set('goalName', encodeURIComponent(config.goalName))
            if (config.goalDate) params.set('goal', config.goalDate)
        }
        // Use current origin (works for both local dev via proxy and production)
        const origin = typeof window !== 'undefined' ? window.location.origin : 'https://jikan.life';
        return `${origin}/generate?${params.toString()}`
    }

    const handleCopy = async () => {
        const url = generateURL()
        if (url) {
            await navigator.clipboard.writeText(url)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const TYPE_NAMES = {
        year: t('type.year.name'),
        life: t('type.life.name'),
        goal: t('type.goal.name'),
    }

    // 按分类分组设备
    const devicesByCategory = {
        iPhone: devices.filter(d => d.category === 'iPhone'),
        Android: devices.filter(d => d.category === 'Android'),
        iPad: devices.filter(d => d.category === 'iPad'),
    }

    return (
        <section id="customize" className="py-24 border-t border-border">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div
                    className="grid gap-12"
                    style={{ gridTemplateColumns: '1fr 2fr' }}
                >
                    {/* Left: Preview Panel */}
                    <div className="flex flex-col items-center sticky top-24 h-fit">
                        <DeviceFrame>
                            <CanvasPreview config={config} />
                        </DeviceFrame>
                        <p className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">
                            {t('preview.hint')}
                        </p>
                    </div>

                    {/* Right: Config Panel */}
                    <div className="space-y-6 py-6">
                        {/* Header */}
                        <div className="space-y-4 mb-8">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                {t('customize.header')}
                            </p>
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                                {t('customize.title')}
                            </h2>
                        </div>

                        {/* Selected Type */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted border border-border rounded-md text-sm mb-8">
                            <span className="text-muted-foreground">{t('customize.selected')}</span>
                            <span className="font-medium">{TYPE_NAMES[config.selectedType] || t('customize.selectedNone')}</span>
                        </div>

                        {/* Location + Language */}
                        <div className={cn("grid grid-cols-2 gap-4 mb-6", !config.selectedType && "opacity-50")}>
                            <div className="space-y-3">
                                <label className="flex items-baseline justify-between text-sm">
                                    <span className="font-medium">{t('config.location')}</span>
                                    <span className="text-xs text-muted-foreground">{t('config.locationHint')}</span>
                                </label>
                                <Select value={config.country} onValueChange={(v) => updateConfig('country', v)} disabled={!config.selectedType}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder={t('placeholder.selectCountry')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {countries.map((country) => {
                                            // 国家代码转国旗 emoji (例: US -> 🇺🇸)
                                            const flag = country.code
                                                .toUpperCase()
                                                .split('')
                                                .map(char => String.fromCodePoint(127397 + char.charCodeAt(0)))
                                                .join('')
                                            return (
                                                <SelectItem key={country.code} value={country.code}>
                                                    {flag} {country.name}
                                                </SelectItem>
                                            )
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-3">
                                <label className="flex items-baseline justify-between text-sm">
                                    <span className="font-medium">{t('config.wallpaperLang')}</span>
                                    <span className="text-xs text-muted-foreground invisible">Placeholder</span>
                                </label>
                                <Select value={config.wallpaperLang} onValueChange={(v) => updateConfig('wallpaperLang', v)} disabled={!config.selectedType}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="en">🇺🇸 English</SelectItem>
                                        <SelectItem value="zh-CN">🇨🇳 简体中文</SelectItem>
                                        <SelectItem value="zh-TW">🇨🇳 繁體中文</SelectItem>
                                        <SelectItem value="ja">🇯🇵 日本語</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Life Calendar Config */}
                        {config.selectedType === 'life' && (
                            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg border border-border mb-6">
                                <div className="space-y-3">
                                    <label className="flex items-baseline justify-between text-sm">
                                        <span className="font-medium">{t('config.dateOfBirth')}</span>
                                        <span className="text-xs text-muted-foreground invisible">placeholder</span>
                                    </label>
                                    <DatePicker
                                        value={config.dob ? parseDate(config.dob) : null}
                                        onChange={(date) => {
                                            if (date) {
                                                updateConfig('dob', date.toString())
                                            } else {
                                                updateConfig('dob', '')
                                            }
                                        }}
                                        maxValue={parseDate(new Date().toISOString().split('T')[0])}
                                    >
                                        <FieldGroup>
                                            <DateInput className="flex-1" variant="ghost" />
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="mr-1 size-6 data-[focus-visible]:ring-offset-0">
                                                <CalendarIcon aria-hidden className="size-4" />
                                            </Button>
                                        </FieldGroup>
                                        <DatePickerContent>
                                            <Calendar>
                                                <CalendarHeading />
                                                <MonthYearPicker />
                                                <CalendarGrid>
                                                    <CalendarGridHeader>
                                                        {(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}
                                                    </CalendarGridHeader>
                                                    <CalendarGridBody>
                                                        {(date) => <CalendarCell date={date} />}
                                                    </CalendarGridBody>
                                                </CalendarGrid>
                                            </Calendar>
                                        </DatePickerContent>
                                    </DatePicker>
                                </div>
                                <div className="space-y-3">
                                    <label className="flex items-baseline justify-between text-sm">
                                        <span className="font-medium">{t('config.lifespan')}</span>
                                        <span className="text-xs text-muted-foreground">{t('config.lifespanHint')}</span>
                                    </label>
                                    <Input
                                        type="number"
                                        className="[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
                                        value={config.lifespan}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            // 允许空字符串和任意数字，不做范围限制
                                            if (val === '') {
                                                updateConfig('lifespan', '');
                                                return;
                                            }
                                            const num = parseInt(val, 10);
                                            if (!isNaN(num)) {
                                                // 直接更新，不钳制范围
                                                updateConfig('lifespan', num);
                                            }
                                        }}
                                        onBlur={() => {
                                            // 失焦时做范围校验和钳制
                                            const val = config.lifespan;
                                            if (val === '' || isNaN(parseInt(val, 10))) {
                                                updateConfig('lifespan', 80);
                                                return;
                                            }
                                            const num = parseInt(val, 10);
                                            // 钳制到 50-120 范围
                                            const clamped = Math.min(120, Math.max(50, num));
                                            if (num !== clamped) {
                                                updateConfig('lifespan', clamped);
                                            }
                                        }}
                                        min={50}
                                        max={120}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Goal Config */}
                        {config.selectedType === 'goal' && (
                            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg border border-border mb-6">
                                <div className="space-y-3">
                                    <label className="text-sm font-medium">{t('config.goalName')}</label>
                                    <Input
                                        type="text"
                                        value={config.goalName}
                                        onChange={(e) => updateConfig('goalName', e.target.value)}
                                        placeholder={t('placeholder.goalName')}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-sm font-medium">{t('config.targetDate')}</label>
                                    <DatePicker
                                        value={config.goalDate ? parseDate(config.goalDate) : null}
                                        onChange={(date) => {
                                            if (date) {
                                                updateConfig('goalDate', date.toString())
                                            } else {
                                                updateConfig('goalDate', '')
                                            }
                                        }}
                                        minValue={parseDate(new Date().toISOString().split('T')[0])}
                                    >
                                        <FieldGroup>
                                            <DateInput className="flex-1" variant="ghost" />
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="mr-1 size-6 data-[focus-visible]:ring-offset-0">
                                                <CalendarIcon aria-hidden className="size-4" />
                                            </Button>
                                        </FieldGroup>
                                        <DatePickerContent>
                                            <Calendar>
                                                <CalendarHeading />
                                                <MonthYearPicker />
                                                <CalendarGrid>
                                                    <CalendarGridHeader>
                                                        {(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}
                                                    </CalendarGridHeader>
                                                    <CalendarGridBody>
                                                        {(date) => <CalendarCell date={date} />}
                                                    </CalendarGridBody>
                                                </CalendarGrid>
                                            </Calendar>
                                        </DatePickerContent>
                                    </DatePicker>
                                </div>
                            </div>
                        )}

                        {/* Colors */}
                        <div className={cn("space-y-4 mb-6", !config.selectedType && "opacity-50 pointer-events-none")}>
                            <label className="text-sm font-medium">{t('config.colors')}</label>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="space-y-2">
                                    <span className="text-xs text-muted-foreground">{t('config.background')}</span>
                                    <ColorPicker
                                        value={config.bgColor}
                                        onChange={(v) => updateConfig('bgColor', v)}
                                        disabled={!config.selectedType}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <span className="text-xs text-muted-foreground">{t('config.accent')}</span>
                                    <ColorPicker
                                        value={config.accentColor}
                                        onChange={(v) => updateConfig('accentColor', v)}
                                        disabled={!config.selectedType}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {PALETTE_PRESETS.map((preset) => (
                                    <ColorPreset
                                        key={preset.id}
                                        bg={preset.bg}
                                        accent={preset.accent}
                                        onClick={applyPreset}
                                        disabled={!config.selectedType}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Device */}
                        <div className={cn("space-y-3 mb-6", !config.selectedType && "opacity-50")}>
                            <label className="flex items-baseline justify-between text-sm">
                                <span className="font-medium">{t('config.device')}</span>
                                {config.selectedType ? (
                                    <span className="text-xs text-muted-foreground">{selectedDevice.width} × {selectedDevice.height}</span>
                                ) : (
                                    <span className="text-xs text-accent">{t('placeholder.selectTypeFirst')}</span>
                                )}
                            </label>
                            <Select
                                value={config.device}
                                onValueChange={(v) => updateConfig('device', v)}
                                disabled={!config.selectedType}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>iPhone</SelectLabel>
                                        {devicesByCategory.iPhone.map(d => (
                                            <SelectItem key={d.name} value={d.name}>{d.name}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                    <SelectGroup>
                                        <SelectLabel>Android</SelectLabel>
                                        {devicesByCategory.Android.map(d => (
                                            <SelectItem key={d.name} value={d.name}>{d.name}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                    <SelectGroup>
                                        <SelectLabel>iPad</SelectLabel>
                                        {devicesByCategory.iPad.map(d => (
                                            <SelectItem key={d.name} value={d.name}>{d.name}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* URL Output */}
                        <div className={cn("space-y-3", !config.selectedType && "opacity-50")}>
                            <label className="text-sm font-medium">{t('config.url')}</label>
                            <div className="flex gap-2">
                                <Input
                                    value={config.selectedType ? generateURL() : t('url.placeholder')}
                                    readOnly
                                    className="font-mono text-xs"
                                />
                                <Button
                                    variant="secondary"
                                    onClick={handleCopy}
                                    disabled={!config.selectedType}
                                    className="shrink-0"
                                >
                                    {copied ? (
                                        <>
                                            <Check className="h-4 w-4 mr-1" />
                                            {t('url.copied')}
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="h-4 w-4 mr-1" />
                                            {t('url.copy')}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
