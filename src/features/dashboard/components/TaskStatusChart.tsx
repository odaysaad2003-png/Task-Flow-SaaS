"use client";

import {motion} from "framer-motion";
import {cn} from "@/lib/utils";
import type {DashboardStats} from "@/features/dashboard/types/dashboard.type";
import {Skeleton} from "@/components/ui/skeleton";

interface TaskStatusChartProps {
    stats?: DashboardStats;
    isLoading: boolean;
}

const STATUS_CONFIG = [
    {
        key: "todo" as const,
        label: "للتنفيذ",
        color: "bg-slate-300 dark:bg-slate-600",
        textColor: "text-slate-600 dark:text-slate-400",
        dotColor: "bg-slate-400",
    },
    {
        key: "in-progress" as const,
        label: "جارٍ",
        color: "bg-blue-400 dark:bg-blue-600",
        textColor: "text-blue-600 dark:text-blue-400",
        dotColor: "bg-blue-500",
    },
    {
        key: "review" as const,
        label: "مراجعة",
        color: "bg-amber-400 dark:bg-amber-600",
        textColor: "text-amber-600 dark:text-amber-400",
        dotColor: "bg-amber-500",
    },
    {
        key: "done" as const,
        label: "مكتمل",
        color: "bg-emerald-400 dark:bg-emerald-600",
        textColor: "text-emerald-600 dark:text-emerald-400",
        dotColor: "bg-emerald-500",
    },
];

export function TaskStatusChart({stats, isLoading}: TaskStatusChartProps) {
    if (isLoading) {
        return (
            <div className="rounded-2xl border bg-card p-6 space-y-4">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-full rounded-full" />
                <div className="grid grid-cols-2 gap-3">
                    {Array.from({length: 4}).map((_, i) => (
                        <Skeleton key={i} className="h-10 rounded-lg" />
                    ))}
                </div>
            </div>
        );
    }

    const byStatus = stats?.tasks.byStatus;
    const total = stats?.tasks.total ?? 0;

    return (
        <div className="rounded-2xl border bg-card p-6 space-y-5">
            <div>
                <h3 className="text-sm font-semibold">توزيع المهام</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{total} مهمة إجمالاً</p>
            </div>

            {/* شريط التوزيع */}
            <div className="flex h-3 w-full overflow-hidden rounded-full gap-0.5">
                {STATUS_CONFIG.map((s, i) => {
                    const count = byStatus?.[s.key] ?? 0;
                    const pct = total > 0 ? (count / total) * 100 : 0;
                    if (pct === 0) return null;
                    return (
                        <motion.div
                            key={s.key}
                            className={cn("h-full rounded-full", s.color)}
                            initial={{width: 0}}
                            animate={{width: `${pct}%`}}
                            transition={{duration: 0.6, delay: i * 0.1, ease: "easeOut"}}
                        />
                    );
                })}
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2.5">
                {STATUS_CONFIG.map((s) => {
                    const count = byStatus?.[s.key] ?? 0;
                    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                    return (
                        <div key={s.key} className="flex items-center justify-between rounded-xl bg-muted/50 px-3 py-2">
                            <div className="flex items-center gap-2">
                                <span className={cn("h-2 w-2 rounded-full shrink-0", s.dotColor)} />
                                <span className={cn("text-xs font-medium", s.textColor)}>{s.label}</span>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-bold text-foreground">{count}</span>
                                <span className="text-[10px] text-muted-foreground mr-1">({pct}%)</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
