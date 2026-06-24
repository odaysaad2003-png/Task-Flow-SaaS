"use client";

import {motion} from "framer-motion";
import Link from "next/link";
import {ArrowLeft, FolderKanban} from "lucide-react";

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import {EmptyState} from "@/components/shared/EmptyState";

import {usePermissions} from "@/features/auth/hooks/use-permissions";
import type {PopulatedProject} from "@/features/projects/types/project.type";
import {cn} from "@/lib/utils";

interface RecentProjectsProps {
    projects?: PopulatedProject[];
    isLoading: boolean;
}

type BadgeVariant = "default" | "secondary" | "outline" | "destructive";

type ProjectStatusConfig = {
    label: string;
    variant: BadgeVariant;
};

const statusConfig: Record<string, ProjectStatusConfig> = {
    active: {
        label: "نشط",
        variant: "default",
    },
    planning: {
        label: "تخطيط",
        variant: "secondary",
    },
    "on-hold": {
        label: "متوقف",
        variant: "outline",
    },
    completed: {
        label: "مكتمل",
        variant: "secondary",
    },
};

const priorityDotColor: Record<string, string> = {
    low: "bg-slate-400",
    medium: "bg-amber-400",
    high: "bg-rose-500",
};

const DEFAULT_STATUS_CONFIG: ProjectStatusConfig = {
    label: "غير معروف",
    variant: "secondary",
};

const DEFAULT_PRIORITY_DOT = "bg-slate-300";

function getInitial(name?: string): string {
    return name?.trim().charAt(0).toUpperCase() || "U";
}

function ProjectRowSkeleton() {
    return (
        <div className="flex animate-pulse items-center gap-3 rounded-xl p-3">
            <Skeleton className="h-9 w-9 shrink-0 rounded-xl" />

            <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-36" />
                <Skeleton className="h-3 w-24" />
            </div>

            <Skeleton className="h-5 w-14 rounded-full" />
        </div>
    );
}

function RecentProjectsSkeleton() {
    return (
        <>
            {Array.from({length: 4}).map((_, index) => (
                <ProjectRowSkeleton key={index} />
            ))}
        </>
    );
}

export function RecentProjects({projects = [], isLoading}: RecentProjectsProps) {
    const {can} = usePermissions();
    const hasProjects = projects.length > 0;

    return (
        <motion.section
            initial={{opacity: 0, y: 16}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.4, delay: 0.2}}
            className="overflow-hidden rounded-2xl border bg-card"
        >
            <div className="flex items-center justify-between border-b px-5 py-4">
                <div>
                    <h3 className="text-sm font-semibold">أحدث المشاريع</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">آخر المشاريع المضافة</p>
                </div>

                <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                    asChild
                >
                    <Link href="/projects">
                        عرض الكل
                        <ArrowLeft className="h-3.5 w-3.5" />
                    </Link>
                </Button>
            </div>

            <div className="space-y-0.5 p-3">
                {isLoading ? (
                    <RecentProjectsSkeleton />
                ) : !hasProjects ? (
                    <EmptyState
                        icon={FolderKanban}
                        title="لا توجد مشاريع بعد"
                        message={can("project:create") ? "ابدأ بإنشاء مشروعك الأول" : "لا توجد مشاريع متاحة لك حالياً"}
                        className="py-10"
                    />
                ) : (
                    projects.map((project, index) => {
                        const status = statusConfig[project.status] ?? {
                            ...DEFAULT_STATUS_CONFIG,
                            label: project.status,
                        };

                        const priorityColor = priorityDotColor[project.priority] ?? DEFAULT_PRIORITY_DOT;

                        return (
                            <motion.article
                                key={project.id}
                                initial={{opacity: 0, x: 10}}
                                animate={{opacity: 1, x: 0}}
                                transition={{delay: 0.3 + index * 0.06}}
                            >
                                <Link
                                    href={`/projects/${project.id}`}
                                    className={cn(
                                        "group flex items-center gap-3 rounded-xl p-3",
                                        "transition-colors duration-200 hover:bg-muted/70"
                                    )}
                                >
                                    <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/40">
                                        <FolderKanban className="h-4 w-4 text-violet-600 dark:text-violet-400" />

                                        <span
                                            className={cn(
                                                "absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-card",
                                                priorityColor
                                            )}
                                        />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium transition-colors group-hover:text-violet-600 dark:group-hover:text-violet-400">
                                            {project.name}
                                        </p>

                                        <div className="mt-0.5 flex items-center gap-1.5">
                                            <Avatar className="h-3.5 w-3.5">
                                                <AvatarImage
                                                    src={project.owner.avatarUrl ?? undefined}
                                                    alt={project.owner.name}
                                                />
                                                <AvatarFallback className="text-[8px]">
                                                    {getInitial(project.owner.name)}
                                                </AvatarFallback>
                                            </Avatar>

                                            <span className="truncate text-[11px] text-muted-foreground">
                                                {project.client.company}
                                            </span>
                                        </div>
                                    </div>

                                    <Badge variant={status.variant} className="h-5 shrink-0 text-[10px]">
                                        {status.label}
                                    </Badge>
                                </Link>
                            </motion.article>
                        );
                    })
                )}
            </div>
        </motion.section>
    );
}
