"use client";

import {motion} from "framer-motion";
import {TrendingUp, TrendingDown, Minus} from "lucide-react";
import {cn} from "@/lib/utils";
import type {StatTrend} from "@/features/dashboard/types/dashboard.type";

interface StatsCardProps {
    label: string;
    value: number | string;
    description: string;
    icon: React.ReactNode;
    trend?: StatTrend;
    trendValue?: string;
    color: "violet" | "blue" | "emerald" | "amber" | "rose";
    suffix?: string;
    isLoading?: boolean;
    index?: number;
}

const colorMap = {
    violet: {
        bg: "bg-violet-50 dark:bg-violet-950/40",
        icon: "bg-violet-100 text-violet-600 dark:bg-violet-900/60 dark:text-violet-400",
        border: "border-violet-100 dark:border-violet-900/50",
        value: "text-violet-700 dark:text-violet-300",
    },
    blue: {
        bg: "bg-blue-50 dark:bg-blue-950/40",
        icon: "bg-blue-100 text-blue-600 dark:bg-blue-900/60 dark:text-blue-400",
        border: "border-blue-100 dark:border-blue-900/50",
        value: "text-blue-700 dark:text-blue-300",
    },
    emerald: {
        bg: "bg-emerald-50 dark:bg-emerald-950/40",
        icon: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/60 dark:text-emerald-400",
        border: "border-emerald-100 dark:border-emerald-900/50",
        value: "text-emerald-700 dark:text-emerald-300",
    },
    amber: {
        bg: "bg-amber-50 dark:bg-amber-950/40",
        icon: "bg-amber-100 text-amber-600 dark:bg-amber-900/60 dark:text-amber-400",
        border: "border-amber-100 dark:border-amber-900/50",
        value: "text-amber-700 dark:text-amber-300",
    },
    rose: {
        bg: "bg-rose-50 dark:bg-rose-950/40",
        icon: "bg-rose-100 text-rose-600 dark:bg-rose-900/60 dark:text-rose-400",
        border: "border-rose-100 dark:border-rose-900/50",
        value: "text-rose-700 dark:text-rose-300",
    },
};

function TrendIcon({trend}: {trend: StatTrend}) {
    if (trend === "up") return <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />;
    if (trend === "down") return <TrendingDown className="h-3.5 w-3.5 text-rose-500" />;
    return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
}

function StatsCardSkeleton() {
    return (
        <div className="rounded-2xl border bg-card p-5 space-y-4 animate-pulse">
            <div className="flex items-start justify-between">
                <div className="h-10 w-10 rounded-xl bg-muted" />
                <div className="h-4 w-16 rounded bg-muted" />
            </div>
            <div className="space-y-2">
                <div className="h-8 w-20 rounded bg-muted" />
                <div className="h-3 w-32 rounded bg-muted" />
            </div>
        </div>
    );
}

export function StatsCard({
    label,
    value,
    description,
    icon,
    trend = "neutral",
    trendValue,
    color,
    suffix,
    isLoading,
    index = 0,
}: StatsCardProps) {
    const colors = colorMap[color];

    if (isLoading) return <StatsCardSkeleton />;

    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{
                duration: 0.4,
                delay: index * 0.08,
                ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className={cn(
                "group relative rounded-2xl border p-5 overflow-hidden",
                "bg-card hover:shadow-md transition-all duration-300",
                "hover:-translate-y-0.5",
                colors.border
            )}
        >
            {/* خلفية ملوّنة خفيفة */}
            <div
                className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                    colors.bg
                )}
            />

            <div className="relative space-y-4">
                <div className="flex items-start justify-between">
                    {/* الأيقونة */}
                    <div className={cn("p-2.5 rounded-xl", colors.icon)}>
                        <div className="h-5 w-5">{icon}</div>
                    </div>

                    {/* الـ Trend */}
                    {trendValue && (
                        <div className="flex items-center gap-1">
                            <TrendIcon trend={trend} />
                            <span className="text-xs font-medium text-muted-foreground">{trendValue}</span>
                        </div>
                    )}
                </div>

                <div>
                    {/* القيمة الرئيسية */}
                    <div className="flex items-baseline gap-1">
                        <motion.span
                            className={cn("text-3xl font-bold tracking-tight", colors.value)}
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            transition={{delay: index * 0.08 + 0.2}}
                        >
                            {typeof value === "number" ? value.toLocaleString("ar-SA") : value}
                        </motion.span>
                        {suffix && <span className="text-sm font-medium text-muted-foreground">{suffix}</span>}
                    </div>

                    {/* التسمية والوصف */}
                    <p className="text-sm font-semibold mt-1 text-foreground/80">{label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
                </div>
            </div>
        </motion.div>
    );
}
