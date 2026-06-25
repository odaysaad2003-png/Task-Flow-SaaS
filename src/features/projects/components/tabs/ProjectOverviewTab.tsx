"use client";

import {useQuery} from "@tanstack/react-query";
import {motion} from "framer-motion";
import {CalendarDays, Users, Building2, CheckSquare, Clock, AlertCircle, TrendingUp} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Skeleton} from "@/components/ui/skeleton";
import {ProjectStatusBadge} from "@/features/projects/components/ProjectStatusBadge";
import {ProjectPriorityBadge} from "@/features/projects/components/ProjectPriorityBadge";
import type {PopulatedProject} from "@/features/projects/types/project.type";
import {apiClient} from "@/lib/api-client";
import {cn} from "@/lib/utils";

interface ProjectOverviewTabProps {
    project: PopulatedProject;
}

interface ProjectStats {
    totalTasks: number;
    doneTasks: number;
    overdueTasks: number;
    completionRate: number;
    totalComments: number;
    tasksByStatus: Record<string, number>;
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("ar-SA", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

function StatItem({
    icon: Icon,
    label,
    value,
    color,
}: {
    icon: React.ElementType;
    label: string;
    value: string | number;
    color: string;
}) {
    return (
        <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-4">
            <div className={cn("rounded-lg p-2", color)}>
                <Icon className="h-4 w-4" />
            </div>
            <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-semibold">{value}</p>
            </div>
        </div>
    );
}

export function ProjectOverviewTab({project}: ProjectOverviewTabProps) {
    const {data: stats, isLoading} = useQuery({
        queryKey: ["projects", project.id, "stats"],
        queryFn: () => apiClient.get<ProjectStats>(`/api/projects/${project.id}/stats`),
        staleTime: 30 * 1000,
    });

    return (
        <motion.div
            initial={{opacity: 0, y: 8}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.3}}
            className="space-y-6"
        >
            {/* وصف المشروع */}
            <div className="rounded-2xl border bg-card p-5">
                <h4 className="text-sm font-semibold mb-2">وصف المشروع</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    {project.description || "لا يوجد وصف لهذا المشروع"}
                </p>
            </div>

            {/* إحصائيات المهام */}
            {isLoading ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {Array.from({length: 4}).map((_, i) => (
                        <Skeleton key={i} className="h-20 rounded-xl" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <StatItem
                        icon={CheckSquare}
                        label="إجمالي المهام"
                        value={stats?.totalTasks ?? 0}
                        color="bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400"
                    />
                    <StatItem
                        icon={TrendingUp}
                        label="نسبة الإنجاز"
                        value={`${stats?.completionRate ?? 0}%`}
                        color="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400"
                    />
                    <StatItem
                        icon={Clock}
                        label="المهام المكتملة"
                        value={stats?.doneTasks ?? 0}
                        color="bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400"
                    />
                    <StatItem
                        icon={AlertCircle}
                        label="المتأخرة"
                        value={stats?.overdueTasks ?? 0}
                        color="bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400"
                    />
                </div>
            )}

            {/* معلومات المشروع */}
            <div className="grid gap-4 sm:grid-cols-2">
                {/* تفاصيل أساسية */}
                <div className="rounded-2xl border bg-card p-5 space-y-3.5">
                    <h4 className="text-sm font-semibold">تفاصيل المشروع</h4>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">الحالة</span>
                            <ProjectStatusBadge status={project.status} />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">الأولوية</span>
                            <ProjectPriorityBadge priority={project.priority} />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                                <CalendarDays className="h-3.5 w-3.5" />
                                تاريخ البداية
                            </span>
                            <span className="text-xs font-medium">{formatDate(project.startDate)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                                <CalendarDays className="h-3.5 w-3.5" />
                                تاريخ الانتهاء
                            </span>
                            <span
                                className={cn(
                                    "text-xs font-medium",
                                    new Date(project.dueDate) < new Date() && project.status !== "completed"
                                        ? "text-rose-600"
                                        : ""
                                )}
                            >
                                {formatDate(project.dueDate)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* الفريق والعميل */}
                <div className="rounded-2xl border bg-card p-5 space-y-3.5">
                    <h4 className="text-sm font-semibold">الفريق والعميل</h4>
                    <div className="space-y-3">
                        {/* العميل */}
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted">
                                <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                            </div>
                            <div>
                                <p className="text-xs font-medium">{project.client.name}</p>
                                <p className="text-[11px] text-muted-foreground">{project.client.company}</p>
                            </div>
                        </div>

                        {/* المالك */}
                        <div className="flex items-center gap-2.5">
                            <Avatar className="h-7 w-7">
                                <AvatarImage src={project.owner.avatarUrl ?? undefined} />
                                <AvatarFallback className="text-xs">{project.owner.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-xs font-medium">{project.owner.name}</p>
                                <p className="text-[11px] text-muted-foreground">مالك المشروع</p>
                            </div>
                        </div>

                        {/* الأعضاء */}
                        {project.memberIds.length > 0 && (
                            <div className="flex items-center gap-2">
                                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted">
                                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    {project.memberIds.length} {project.memberIds.length === 1 ? "عضو" : "أعضاء"}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
