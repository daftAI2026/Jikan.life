/**
 * [INPUT]: 依赖 @phosphor-icons/react, react, @/components/ui/button, @/lib/I18nContext
 * [OUTPUT]: Types Section 组件 (展示三种壁纸类型 + i18n)
 * [POS]: Landing Page 第二部分，展示核心产品功能
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { ArrowRight, Check } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState, useEffect, useMemo } from "react"
import { useI18n } from "@/lib/I18nContext"

// --- Helper Functions ---

function getDayOfYear() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}

function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function getYearStats() {
    const now = new Date();
    const day = getDayOfYear();
    const totalDays = isLeapYear(now.getFullYear()) ? 366 : 365;
    const week = Math.ceil(day / 7);
    const percent = Math.round((day / totalDays) * 100);

    return { day, week, percent };
}

// --- Visual Components ---

function YearVisual() {
    const [stats, setStats] = useState({ day: 0 });

    useEffect(() => {
        setStats(getYearStats());
    }, []);

    const filledCount = Math.floor(stats.day / 8);
    const totalDots = 45;

    return (
        <div className="grid grid-cols-[repeat(15,1fr)] gap-[4px] p-4 place-items-center">
            {Array.from({ length: totalDots }).map((_, i) => (
                <div
                    key={i}
                    className={cn(
                        "w-[10px] h-[10px] rounded-full transition-colors duration-500",
                        i < filledCount ? "bg-kumo-contrast" : "bg-kumo-fill"
                    )}
                />
            ))}
        </div>
    )
}

function LifeVisual() {
    const filledCount = 25;
    const totalDots = 65;

    return (
        <div className="grid grid-cols-[repeat(13,1fr)] gap-[2px] p-4 place-items-center">
            {Array.from({ length: totalDots }).map((_, i) => (
                <div
                    key={i}
                    className={cn(
                        "w-[6px] h-[6px] rounded-full transition-colors duration-500",
                        i < filledCount ? "bg-kumo-contrast" : "bg-kumo-fill"
                    )}
                />
            ))}
        </div>
    )
}

function GoalVisual({ t }) {
    return (
        <div className="flex items-center justify-center h-full">
            <div className="relative w-[100px] h-[100px]">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4" className="text-kumo-fill" />
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeDasharray="283" strokeDashoffset="100" className="text-kumo-contrast transition-all duration-1000 ease-out" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold font-mono leading-none">42</span>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">{t('type.year.statDay')}</span>
                </div>
            </div>
        </div>
    )
}

// --- Components ---

function TypeCard({ type, isSelected, onSelect, t }) {
    const Visual = type.visual

    // 哥，这里之前用 state 存 dynamicStats 是错误的，导致语言切换不更新
    // 应该根据 type 动态计算，保持单一真相源
    const currentStats = useMemo(() => {
        if (type.id === 'year') {
            const { day, week, percent } = getYearStats();
            return [
                { label: t('type.year.statDay'), value: day },
                { label: t('type.year.statWeek'), value: week },
                { label: t('type.year.statComplete'), value: `${percent}%` },
            ];
        }
        return type.stats;
    }, [type.id, type.stats, t]);

    return (
        <article
            className={cn(
                "group relative bg-kumo-base shadow-xs ring ring-kumo-line rounded-2xl overflow-hidden cursor-pointer transition-all duration-300",
                "hover:ring-kumo-ring hover:-translate-y-1 hover:shadow-sm",
                isSelected ? "ring-2 ring-kumo-contrast" : ""
            )}
            onClick={() => onSelect(type.id)}
        >
            <div className="h-[200px] bg-kumo-elevated flex items-center justify-center border-b border-kumo-line overflow-hidden relative">
                <Visual t={t} />
            </div>

            <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-mono font-bold text-muted-foreground">0{type.index}</span>
                    <h3 className="text-lg font-semibold tracking-tight">{type.name}</h3>
                </div>

                <p className="text-sm text-muted-foreground mb-6 leading-relaxed min-h-12 line-clamp-2">{type.description}</p>

                <div className="flex items-center gap-4 py-4 border-t border-b border-kumo-line mb-5">
                    {currentStats.map((stat, i) => (
                        <div key={i} className="flex flex-col flex-1 relative">
                            <span className="text-lg font-mono font-semibold leading-none mb-1">{stat.value}</span>
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{stat.label}</span>
                            {i < currentStats.length - 1 && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-8 bg-kumo-line" />}
                        </div>
                    ))}
                </div>

                <Button
                    variant={isSelected ? "default" : "outline"}
                    className={cn("w-full justify-between group/btn", isSelected ? "bg-primary text-primary-foreground" : "bg-transparent")}
                >
                    <span>{isSelected ? t('button.selected') : t('button.select')}</span>
                    {isSelected ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />}
                </Button>
            </div>
        </article>
    )
}

export function TypesSection({ onSelectType }) {
    const { t } = useI18n()
    const [selectedType, setSelectedType] = useState(null)

    const handleSelect = (typeId) => {
        setSelectedType(typeId)
        onSelectType?.(typeId)
    }

    const TYPES = useMemo(() => [
        {
            id: 'year',
            index: 1,
            name: t('type.year.name'),
            description: t('type.year.description'),
            visual: YearVisual,
            stats: [
                { label: t('type.year.statDay'), value: '--' },
                { label: t('type.year.statWeek'), value: '--' },
                { label: t('type.year.statComplete'), value: '--%' },
            ]
        },
        {
            id: 'life',
            index: 2,
            name: t('type.life.name'),
            description: t('type.life.description'),
            visual: LifeVisual,
            stats: [
                { label: t('type.life.statWeeks'), value: t('type.life.valueWeeks') },
                { label: t('type.life.statYears'), value: t('type.life.valueYears') },
            ]
        },
        {
            id: 'goal',
            index: 3,
            name: t('type.goal.name'),
            description: t('type.goal.description'),
            visual: GoalVisual,
            stats: [
                { label: t('type.goal.statGoals'), value: '∞' },
                { label: t('type.goal.statUpdates'), value: t('type.goal.valueDaily') },
            ]
        }
    ], [t])

    return (
        <section id="types" className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
            <div className="text-center mb-16 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{t('types.header')}</p>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">{t('types.title')}</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {TYPES.map((type) => (
                    <TypeCard key={type.id} type={type} isSelected={selectedType === type.id} onSelect={handleSelect} t={t} />
                ))}
            </div>
        </section>
    )
}
