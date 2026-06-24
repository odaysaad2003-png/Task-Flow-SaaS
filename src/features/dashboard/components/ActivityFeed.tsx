"use client";

import type {ReactNode} from "react";
import {motion} from "framer-motion";
import {Plus, Pencil, Trash2, ArrowRight, UserCheck, MessageSquare, RefreshCw} from "lucide-react";

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Skeleton} from "@/components/ui/skeleton";
import {EmptyState} from "@/components/shared/EmptyState";
import type {PopulatedActivityLog} from "@/features/activity/types/activity.type";
import {cn} from "@/lib/utils";

interface ActivityFeedProps {
    activities?: PopulatedActivityLog[];
    isLoading: boolean;
}

type ActivityActionConfig = {
    icon: ReactNode;
    iconBg: string;
    label: string;
};

const actionConfig: Record<string, ActivityActionConfig> = {
    created: {
        icon: <Plus className="h-3 w-3" />,
        iconBg: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400",
        label: "أنشأ",
    },
    updated: {
        icon: <Pencil className="h-3 w-3" />,
        iconBg: "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400",
        label: "عدّل",
    },
    deleted: {
        icon: <Trash2 className="h-3 w-3" />,
        iconBg: "bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400",
        label: "حذف",
    },
    status_changed: {
        icon: <RefreshCw className="h-3 w-3" />,
        iconBg: "bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400",
        label: "غيّر حالة",
    },
    assigned: {
        icon: <UserCheck className="h-3 w-3" />,
        iconBg: "bg-violet-100 text-violet-600 dark:bg-violet-900/50 dark:text-violet-400",
        label: "أسند",
    },
    commented: {
        icon: <MessageSquare className="h-3 w-3" />,
        iconBg: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
        label: "علّق على",
    },
};

function getRelativeTime(dateStr: string): string {
    const timestamp = new Date(dateStr).getTime();

    if (Number.isNaN(timestamp)) {
        return "وقت غير معروف";
    }

    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60_000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        return `منذ ${days} ${days === 1 ? "يوم" : "أيام"}`;
    }

    if (hours > 0) {
        return `منذ ${hours} ${hours === 1 ? "ساعة" : "ساعات"}`;
    }

    if (minutes > 0) {
        return `منذ ${minutes} ${minutes === 1 ? "دقيقة" : "دقائق"}`;
    }

    return "الآن";
}

function getFirstName(fullName: string): string {
    return fullName.trim().split(" ")[0] || "مستخدم";
}

function getAvatarFallback(name: string): string {
    return name.trim().charAt(0).toUpperCase() || "U";
}

function cleanActivityMessage(message: string, actorName: string): string {
    return message.replace(actorName, "").trim();
}

export function ActivityFeed({activities = [], isLoading}: ActivityFeedProps) {
    const hasActivities = activities.length > 0;

    return (
        <motion.section
            initial={{opacity: 0, y: 16}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.4, delay: 0.4}}
            className="overflow-hidden rounded-2xl border bg-card"
        >
            <div className="flex items-center justify-between border-b px-5 py-4">
                <div>
                    <h3 className="text-sm font-semibold">سجل النشاط</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">آخر الأحداث في المشروع</p>
                </div>

                <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    <span className="text-[11px] text-muted-foreground">مباشر</span>
                </div>
            </div>

            <div className="p-4">
                {isLoading ? (
                    <ActivityFeedSkeleton />
                ) : !hasActivities ? (
                    <EmptyState
                        icon={ArrowRight}
                        title="لا يوجد نشاط بعد"
                        message="ستظهر هنا الأحداث عند بدء العمل على المشاريع"
                        className="py-8"
                    />
                ) : (
                    <div className="relative">
                        <div className="absolute bottom-4 right-[13px] top-4 w-px bg-border" />

                        <div className="space-y-4">
                            {activities.map((activity, index) => {
                                const config = actionConfig[activity.action] ?? actionConfig.updated;

                                const actorName = activity.actor.name;
                                const displayName = getFirstName(actorName);
                                const message = cleanActivityMessage(activity.message, actorName);

                                return (
                                    <motion.article
                                        key={activity.id}
                                        initial={{opacity: 0, x: 8}}
                                        animate={{opacity: 1, x: 0}}
                                        transition={{delay: 0.45 + index * 0.04}}
                                        className="relative flex gap-3"
                                    >
                                        <div
                                            className={cn(
                                                "relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-card",
                                                config.iconBg
                                            )}
                                            aria-label={config.label}
                                        >
                                            {config.icon}
                                        </div>

                                        <div className="min-w-0 flex-1 pt-0.5">
                                            <div className="flex flex-wrap items-start gap-1">
                                                <span className="text-xs font-semibold text-foreground">
                                                    {displayName}
                                                </span>

                                                <span className="text-xs leading-relaxed text-muted-foreground">
                                                    {message}
                                                </span>
                                            </div>

                                            <div className="mt-1 flex items-center gap-2">
                                                <Avatar className="h-3.5 w-3.5">
                                                    <AvatarImage
                                                        src={activity.actor.avatarUrl ?? undefined}
                                                        alt={actorName}
                                                    />
                                                    <AvatarFallback className="text-[8px]">
                                                        {getAvatarFallback(actorName)}
                                                    </AvatarFallback>
                                                </Avatar>

                                                <time
                                                    className="text-[11px] text-muted-foreground"
                                                    dateTime={activity.createdAt}
                                                >
                                                    {getRelativeTime(activity.createdAt)}
                                                </time>
                                            </div>
                                        </div>
                                    </motion.article>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </motion.section>
    );
}

function ActivityFeedSkeleton() {
    return (
        <div className="space-y-4">
            {Array.from({length: 5}).map((_, index) => (
                <div key={index} className="flex gap-3">
                    <Skeleton className="h-7 w-7 shrink-0 rounded-full" />

                    <div className="flex-1 space-y-1.5 pt-0.5">
                        <Skeleton className="h-3.5 w-full" />
                        <Skeleton className="h-3 w-20" />
                    </div>
                </div>
            ))}
        </div>
    );
}
