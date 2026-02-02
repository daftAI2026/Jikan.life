/**
 * [INPUT]: 依赖 lucide-react, react, @/components/ui/button
 * [OUTPUT]: Types Section 组件 (展示三种壁纸类型)
 * [POS]: Landing Page 第二部分，展示核心产品功能
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

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
    // Original: 15 columns, 45 cells total (approx 3 rows)
    // Logic: i < Math.floor(dayOfYear / 8)
    const [stats, setStats] = useState({ day: 0 });

    useEffect(() => {
        setStats(getYearStats());
    }, []);

    const filledCount = Math.floor(stats.day / 8);
    const totalDots = 45; // 15 cols * 3 rows

    return (
        <div className="grid grid-cols-[repeat(15,1fr)] gap-[4px] p-4 place-items-center">
            {Array.from({ length: totalDots }).map((_, i) => (
                <div
                    key={i}
                    className={cn(
                        "w-[10px] h-[10px] rounded-full transition-colors duration-500",
                        i < filledCount
                            ? "bg-foreground"
                            : "bg-foreground/10" // rgba(255,255,255,0.1) in dark mode
                    )}
                />
            ))}
        </div>
    )
}

function LifeVisual() {
    // Original: 13 columns, 65 dots (5 rows)
    // Logic: i < 25 (Static preview from original code)
    const filledCount = 25;
    const totalDots = 65;

    return (
        <div className="grid grid-cols-[repeat(13,1fr)] gap-[2px] p-4 place-items-center">
            {Array.from({ length: totalDots }).map((_, i) => (
                <div
                    key={i}
                    className={cn(
                        "w-[6px] h-[6px] rounded-full transition-colors duration-500",
                        i < filledCount
                            ? "bg-foreground"
                            : "bg-foreground/10"
                    )}
                />
            ))}
        </div>
    )
}

function GoalVisual() {
    return (
        <div className="flex items-center justify-center h-full">
            <div className="relative w-[100px] h-[100px]">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        className="text-foreground/10"
                    />
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray="283"
                        strokeDashoffset="100" // 65% filled
                        className="text-foreground transition-all duration-1000 ease-out"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold font-mono leading-none">42</span>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">days</span>
                </div>
            </div>
        </div>
    )
}

// --- Components ---

function TypeCard({ type, isSelected, onSelect }) {
    const Visual = type.visual
    // Use dynamic stats for Year type, static for others for now
    const [dynamicStats, setDynamicStats] = useState(type.stats);

    useEffect(() => {
        if (type.id === 'year') {
            const { day, week, percent } = getYearStats();
            setDynamicStats([
                { label: 'Day', value: day },
                { label: 'Week', value: week },
                { label: 'Complete', value: `${percent}%` },
            ]);
        }
    }, [type.id]);

    return (
        <article
            className={cn(
                "group relative bg-card border border-border rounded-2xl overflow-hidden cursor-pointer transition-all duration-300",
                "hover:border-primary/50 hover:-translate-y-1 hover:shadow-xl",
                isSelected ? "border-primary ring-1 ring-primary" : ""
            )}
            onClick={() => onSelect(type.id)}
        >
            {/* Visual Header */}
            <div className="h-[200px] bg-muted/30 flex items-center justify-center border-b border-border overflow-hidden relative">
                <Visual />
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-mono font-bold text-muted-foreground">
                        0{type.index}
                    </span>
                    <h3 className="text-lg font-semibold tracking-tight">{type.name}</h3>
                </div>

                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                    {type.description}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 py-4 border-t border-b border-border/50 mb-5">
                    {dynamicStats.map((stat, i) => (
                        <div key={i} className="flex flex-col flex-1 relative">
                            <span className="text-lg font-mono font-semibold leading-none mb-1">
                                {stat.value}
                            </span>
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                {stat.label}
                            </span>
                            {i < dynamicStats.length - 1 && (
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-8 bg-border" />
                            )}
                        </div>
                    ))}
                </div>

                {/* Select Button */}
                <Button
                    variant={isSelected ? "default" : "outline"}
                    className={cn(
                        "w-full justify-between group/btn",
                        isSelected ? "bg-primary text-primary-foreground" : "bg-transparent"
                    )}
                >
                    <span>{isSelected ? "Selected" : "Select"}</span>
                    {isSelected ? (
                        <Check className="w-4 h-4" />
                    ) : (
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    )}
                </Button>
            </div>
        </article>
    )
}

export function TypesSection({ onSelectType }) {
    const [selectedType, setSelectedType] = useState(null)

    const handleSelect = (typeId) => {
        setSelectedType(typeId)
        onSelectType?.(typeId)
    }

    const TYPES = [
        {
            id: 'year',
            index: 1,
            name: 'Year Progress',
            description: 'Every day of the year as a grid. Watch your year fill up, one square at a time.',
            visual: YearVisual,
            stats: [ // Default placeholders, will be hydrated
                { label: 'Day', value: '--' },
                { label: 'Week', value: '--' },
                { label: 'Complete', value: '--%' },
            ]
        },
        {
            id: 'life',
            index: 2,
            name: 'Life Calendar',
            description: 'Every week of your life as a dot. A powerful reminder to make each week count.',
            visual: LifeVisual,
            stats: [
                { label: 'Total Weeks', value: '4,160' },
                { label: 'Years', value: '80' },
            ]
        },
        {
            id: 'goal',
            index: 3,
            name: 'Goal Countdown',
            description: 'Count down to what matters. Big launch, vacation, or life milestone.',
            visual: GoalVisual,
            stats: [
                { label: 'Goals', value: '∞' },
                { label: 'Updates', value: 'Daily' },
            ]
        }
    ]

    return (
        <section id="types" className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Choose Your Style
                </p>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                    Three ways to see your time
                </h2>
            </div>
            {/* Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {TYPES.map((type) => (
                    <TypeCard
                        key={type.id}
                        type={type}
                        isSelected={selectedType === type.id}
                        onSelect={handleSelect}
                    />
                ))}
            </div>
        </section>
    )
}
