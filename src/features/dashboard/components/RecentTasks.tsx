"use client";

import type {ReactNode} from "react";
import {motion} from "framer-motion";
import Link from "next/link";
import {AlertCircle, ArrowLeft, CheckCircle2, Circle, Clock} from "lucide-react";

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import {EmptyState} from "@/components/shared/EmptyState";

import type {PopulatedTask} from "@/features/tasks/types/task.type";
import {cn} from "@/lib/utils";

interface RecentTasksProps {
    tasks?: PopulatedTask[];
    isLoading: boolean;
    title?: string;
    emptyMessage?: string;
}

type TaskStatusIconConfig = ReactNode;

type PriorityConfig = {
    label: string;
    className: string;
};

const statusIconMap: Record<string, TaskStatusIconConfig> = {
    todo: <Circle className="h-4 w-4 text-slate-400" />,
    "in-progress": <Clock className="h-4 w-4 text-blue-500" />,
    review: <AlertCircle className="h-4 w-4 text-amber-500" />,
    done: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
};

const priorityConfig: Record<string, PriorityConfig> = {
    low: {
        label: "منخفضة",
        className: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    },
    medium: {
        label: "متوسطة",
        className: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
    },
    high: {
        label: "عالية",
        className: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
    },
    urgent: {
        label: "عاجلة",
        className: "bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400",
    },
};

const DEFAULT_STATUS_ICON = <Circle className="h-4 w-4 text-slate-400" />;

const DEFAULT_PRIORITY_CONFIG: PriorityConfig = {
    label: "غير محددة",
    className: "bg-muted text-muted-foreground dark:bg-muted dark:text-muted-foreground",
};

function getInitial(name?: string): string {
    return name?.trim().charAt(0).toUpperCase() || "U";
}

function getFirstName(name?: string): string {
    return name?.trim().split(" ")[0] || "مستخدم";
}

function isOverdue(dueDate?: string | null, status?: string): boolean {
    if (!dueDate || status === "done") {
        return false;
    }

    const dueDateTime = new Date(dueDate).getTime();

    if (Number.isNaN(dueDateTime)) {
        return false;
    }

    return dueDateTime < Date.now();
}

function formatDueDate(dueDate: string): string {
    const date = new Date(dueDate);

    if (Number.isNaN(date.getTime())) {
        return "تاريخ غير صالح";
    }

    return date.toLocaleDateString("ar-SA", {
        month: "short",
        day: "numeric",
    });
}

function TaskRowSkeleton() {
    return (
        <div className="flex animate-pulse items-center gap-3 p-3">
            <Skeleton className="h-4 w-4 shrink-0 rounded-full" />

            <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-48" />
                <Skeleton className="h-3 w-24" />
            </div>

            <Skeleton className="h-5 w-16 shrink-0 rounded-full" />
        </div>
    );
}

function RecentTasksSkeleton() {
    return (
        <>
            {Array.from({length: 5}).map((_, index) => (
                <TaskRowSkeleton key={index} />
            ))}
        </>
    );
}

export function RecentTasks({
    tasks = [],
    isLoading,
    title = "آخر المهام",
    emptyMessage = "لا توجد مهام حالياً",
}: RecentTasksProps) {
    const hasTasks = tasks.length > 0;

    return (
        <motion.section
            initial={{opacity: 0, y: 16}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.4, delay: 0.3}}
            className="overflow-hidden rounded-2xl border bg-card"
        >
            <div className="flex items-center justify-between border-b px-5 py-4">
                <div>
                    <h3 className="text-sm font-semibold">{title}</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">{tasks.length} مهمة</p>
                </div>

                <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                    asChild
                >
                    <Link href="/tasks">
                        عرض الكل
                        <ArrowLeft className="h-3.5 w-3.5" />
                    </Link>
                </Button>
            </div>

            <div className="divide-y divide-border/50">
                {isLoading ? (
                    <RecentTasksSkeleton />
                ) : !hasTasks ? (
                    <EmptyState icon={CheckCircle2} title="لا توجد مهام" message={emptyMessage} className="py-10" />
                ) : (
                    tasks.map((task, index) => {
                        const statusIcon = statusIconMap[task.status] ?? DEFAULT_STATUS_ICON;
                        const priority = priorityConfig[task.priority] ?? DEFAULT_PRIORITY_CONFIG;
                        const taskIsDone = task.status === "done";
                        const taskIsOverdue = isOverdue(task.dueDate, task.status);

                        return (
                            <motion.article
                                key={task.id}
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                transition={{delay: 0.35 + index * 0.05}}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3",
                                    "transition-colors duration-150 hover:bg-muted/50",
                                    taskIsDone && "opacity-60"
                                )}
                            >
                                <span className="shrink-0" aria-hidden="true">
                                    {statusIcon}
                                </span>

                                <div className="min-w-0 flex-1">
                                    <p
                                        className={cn(
                                            "truncate text-sm font-medium",
                                            taskIsDone && "text-muted-foreground line-through"
                                        )}
                                    >
                                        {task.title}
                                    </p>

                                    <div className="mt-0.5 flex items-center gap-2">
                                        {task.assignee ? (
                                            <div className="flex items-center gap-1">
                                                <Avatar className="h-3.5 w-3.5">
                                                    <AvatarImage
                                                        src={task.assignee.avatarUrl ?? undefined}
                                                        alt={task.assignee.name}
                                                    />
                                                    <AvatarFallback className="text-[8px]">
                                                        {getInitial(task.assignee.name)}
                                                    </AvatarFallback>
                                                </Avatar>

                                                <span className="text-[11px] text-muted-foreground">
                                                    {getFirstName(task.assignee.name)}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-[11px] text-muted-foreground">غير مسندة</span>
                                        )}

                                        {task.dueDate ? (
                                            <time
                                                dateTime={task.dueDate}
                                                className={cn(
                                                    "text-[11px]",
                                                    taskIsOverdue
                                                        ? "font-medium text-rose-500"
                                                        : "text-muted-foreground"
                                                )}
                                            >
                                                {formatDueDate(task.dueDate)}
                                            </time>
                                        ) : null}
                                    </div>
                                </div>

                                <span
                                    className={cn(
                                        "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium",
                                        priority.className
                                    )}
                                >
                                    {priority.label}
                                </span>
                            </motion.article>
                        );
                    })
                )}
            </div>
        </motion.section>
    );
}
