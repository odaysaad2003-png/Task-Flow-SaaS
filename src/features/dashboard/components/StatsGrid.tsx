"use client";

import {FolderKanban, CheckCircle2, Clock, Users, TrendingUp, AlertCircle} from "lucide-react";
import {StatsCard} from "./StatsCard";
import type {DashboardStats} from "@/features/dashboard/types/dashboard.type";
import {usePermissions} from "@/features/auth/hooks/use-permissions";

interface StatsGridProps {
    stats?: DashboardStats;
    isLoading: boolean;
}

export function StatsGrid({stats, isLoading}: StatsGridProps) {
    const {can} = usePermissions();

    // بطاقات مرئية لكل المستخدمين
    const baseCards = [
        {
            label: "المشاريع النشطة",
            value: stats?.projects.active ?? 0,
            description: `${stats?.projects.total ?? 0} مشروع إجمالاً`,
            icon: <FolderKanban className="h-full w-full" />,
            color: "violet" as const,
            trend: "up" as const,
            trendValue: "+2 هذا الشهر",
        },
        {
            label: "نسبة الإنجاز",
            value: stats?.completionRate ?? 0,
            description: `${stats?.tasks.byStatus.done ?? 0} مهمة مكتملة`,
            icon: <TrendingUp className="h-full w-full" />,
            suffix: "%",
            color: "emerald" as const,
            trend: "up" as const,
            trendValue: "عن الشهر الماضي",
        },
        {
            label: "مهامي",
            value: stats?.tasks.myTasks ?? 0,
            description: "المهام المسندة إليك",
            icon: <CheckCircle2 className="h-full w-full" />,
            color: "blue" as const,
            trend: "neutral" as const,
        },
        {
            label: "المهام المتأخرة",
            value: stats?.tasks.overdue ?? 0,
            description: "تجاوزت تاريخ الاستحقاق",
            icon: <AlertCircle className="h-full w-full" />,
            color: "rose" as const,
            trend: stats && stats.tasks.overdue > 0 ? ("down" as const) : ("neutral" as const),
            trendValue: stats && stats.tasks.overdue > 0 ? "تحتاج انتباهاً" : undefined,
        },
    ];

    // بطاقات للـ admin فقط
    const adminCards = can("team:manage")
        ? [
              {
                  label: "العملاء النشطون",
                  value: stats?.totalClients ?? 0,
                  description: "عميل بمشاريع جارية",
                  icon: <Clock className="h-full w-full" />,
                  color: "amber" as const,
                  trend: "neutral" as const,
              },
              {
                  label: "أعضاء الفريق",
                  value: stats?.totalMembers ?? 0,
                  description: "في هذا الفضاء",
                  icon: <Users className="h-full w-full" />,
                  color: "violet" as const,
                  trend: "neutral" as const,
              },
          ]
        : [];

    const allCards = [...baseCards, ...adminCards];

    return (
        <div
            className="grid gap-4"
            style={{
                gridTemplateColumns: `repeat(${Math.min(allCards.length, 4)}, minmax(0, 1fr))`,
            }}
        >
            {allCards.map((card, i) => (
                <StatsCard key={card.label} {...card} isLoading={isLoading} index={i} />
            ))}
        </div>
    );
}
