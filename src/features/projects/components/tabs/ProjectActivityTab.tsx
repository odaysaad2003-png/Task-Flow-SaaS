"use client";

import {useQuery} from "@tanstack/react-query";
import {motion} from "framer-motion";
import {Plus, Pencil, Trash2, RefreshCw, UserCheck, MessageSquare, Activity} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Skeleton} from "@/components/ui/skeleton";
import {EmptyState} from "@/components/shared/EmptyState";
import {apiClient} from "@/lib/api-client";
import type {PopulatedActivityLog} from "@/features/activity/types/activity.type";
import {cn} from "@/lib/utils";

interface ProjectActivityTabProps {
    projectId: string;
}

const ACTION_CONFIG: Record<string, {icon: React.ElementType; bg: string; color: string}> = {
    created: {icon: Plus, bg: "bg-emerald-100 dark:bg-emerald-900/40", color: "text-emerald-600 dark:text-emerald-400"},
    updated: {icon: Pencil, bg: "bg-blue-100 dark:bg-blue-900/40", color: "text-blue-600 dark:text-blue-400"},
    deleted: {icon: Trash2, bg: "bg-rose-100 dark:bg-rose-900/40", color: "text-rose-600 dark:text-rose-400"},
    status_changed: {
        icon: RefreshCw,
        bg: "bg-amber-100 dark:bg-amber-900/40",
        color: "text-amber-600 dark:text-amber-400",
    },
    assigned: {
        icon: UserCheck,
        bg: "bg-violet-100 dark:bg-violet-900/40",
        color: "text-violet-600 dark:text-violet-400",
    },
    commented: {icon: MessageSquare, bg: "bg-slate-100 dark:bg-slate-800", color: "text-slate-600 dark:text-slate-400"},
};

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `منذ ${days} ${days === 1 ? "يوم" : "أيام"}`;
    if (hours > 0) return `منذ ${hours} ${hours === 1 ? "ساعة" : "ساعات"}`;
    if (mins > 0) return `منذ ${mins} ${mins === 1 ? "دقيقة" : "دقائق"}`;
    return "الآن";
}

export function ProjectActivityTab({projectId}: ProjectActivityTabProps) {
    const {data: activities, isLoading} = useQuery({
        queryKey: ["activity", "project", projectId],
        queryFn: () =>
            apiClient.get<PopulatedActivityLog[]>("/api/activity", {
                params: {entityId: projectId, limit: 20},
            }),
        staleTime: 30 * 1000,
    });

    if (isLoading) {
        return (
            <div className="space-y-4">
                {Array.from({length: 6}).map((_, i) => (
                    <div key={i} className="flex gap-3 animate-pulse">
                        <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                        <div className="flex-1 space-y-1.5 pt-1">
                            <Skeleton className="h-3.5 w-full" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!activities?.length) {
        return (
            <EmptyState icon={Activity} title="لا يوجد نشاط بعد" message="ستظهر هنا كل الأحداث المرتبطة بهذا المشروع" />
        );
    }

    return (
        <motion.div initial={{opacity: 0, y: 8}} animate={{opacity: 1, y: 0}} transition={{duration: 0.3}}>
            <div className="relative pr-4">
                {/* الخط الرأسي */}
                <div className="absolute right-[15px] top-4 bottom-4 w-px bg-border" />

                <div className="space-y-5">
                    {activities.map((activity, i) => {
                        const config = ACTION_CONFIG[activity.action] ?? ACTION_CONFIG.updated;
                        const Icon = config.icon;

                        return (
                            <motion.div
                                key={activity.id}
                                initial={{opacity: 0, x: 10}}
                                animate={{opacity: 1, x: 0}}
                                transition={{delay: i * 0.04}}
                                className="flex gap-3 relative"
                            >
                                {/* أيقونة الحدث */}
                                <div
                                    className={cn(
                                        "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center",
                                        "rounded-full border-2 border-background",
                                        config.bg,
                                        config.color
                                    )}
                                >
                                    <Icon className="h-3.5 w-3.5" />
                                </div>

                                {/* المحتوى */}
                                <div className="flex-1 pt-0.5 min-w-0">
                                    <div className="flex items-start gap-2">
                                        <Avatar className="h-5 w-5 shrink-0 mt-0.5">
                                            <AvatarImage src={activity.actor.avatarUrl ?? undefined} />
                                            <AvatarFallback className="text-[9px]">
                                                {activity.actor.name[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <p className="text-sm text-foreground/90 leading-relaxed">
                                            <span className="font-semibold">{activity.actor.name.split(" ")[0]}</span>{" "}
                                            {activity.message.replace(activity.actor.name, "").trim()}
                                        </p>
                                    </div>
                                    <p className="text-[11px] text-muted-foreground mt-1 pr-7">
                                        {timeAgo(activity.createdAt)}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
}
