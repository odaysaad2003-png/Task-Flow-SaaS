"use client";

import Link from "next/link";
import {motion} from "framer-motion";
import {MoreHorizontal, Pencil, Trash2, CalendarDays, Users, CheckSquare} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {ProjectStatusBadge} from "./ProjectStatusBadge";
import {ProjectPriorityBadge} from "./ProjectPriorityBadge";
import type {PopulatedProject} from "@/features/projects/types/project.type";
import {usePermissions} from "@/features/auth/hooks/use-permissions";
import {cn} from "@/lib/utils";

interface ProjectCardProps {
    project: PopulatedProject;
    index: number;
    onEdit: (project: PopulatedProject) => void;
    onDelete: (project: PopulatedProject) => void;
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("ar-SA", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function isOverdue(dueDateStr: string, status: string): boolean {
    if (status === "completed") return false;
    return new Date(dueDateStr) < new Date();
}

export function ProjectCard({project, index, onEdit, onDelete}: ProjectCardProps) {
    const {can} = usePermissions();

    const overdue = isOverdue(project.dueDate, project.status);

    return (
        <motion.div
            initial={{opacity: 0, y: 16}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, scale: 0.97}}
            transition={{
                duration: 0.35,
                delay: index * 0.06,
                ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className={cn(
                "group relative flex flex-col rounded-2xl border bg-card",
                "hover:shadow-md hover:-translate-y-0.5 transition-all duration-300",
                overdue && "border-rose-200 dark:border-rose-900/50"
            )}
        >
            {/* ─── Card Header ───────────────────────────────── */}
            <div className="flex items-start justify-between p-5 pb-3">
                <div className="flex-1 min-w-0 pr-2">
                    <Link href={`/projects/${project.id}`}>
                        <h3 className="text-sm font-semibold leading-snug truncate group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors cursor-pointer">
                            {project.name}
                        </h3>
                    </Link>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{project.client.company}</p>
                </div>

                {/* Actions Dropdown — مشروط بالصلاحية */}
                {(can("project:create") || can("project:delete")) && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                            {can("project:create") && (
                                <DropdownMenuItem onClick={() => onEdit(project)}>
                                    <Pencil className="ml-2 h-3.5 w-3.5" />
                                    تعديل المشروع
                                </DropdownMenuItem>
                            )}
                            {can("project:delete") && (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="text-destructive focus:text-destructive"
                                        onClick={() => onDelete(project)}
                                    >
                                        <Trash2 className="ml-2 h-3.5 w-3.5" />
                                        حذف المشروع
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>

            {/* ─── Description ────────────────────────────────── */}
            <p className="px-5 text-xs text-muted-foreground leading-relaxed line-clamp-2 min-h-[2.5rem]">
                {project.description || "لا يوجد وصف لهذا المشروع"}
            </p>

            {/* ─── Badges ─────────────────────────────────────── */}
            <div className="flex items-center gap-2 px-5 pt-3">
                <ProjectStatusBadge status={project.status} />
                <ProjectPriorityBadge priority={project.priority} />
            </div>

            {/* ─── Meta ───────────────────────────────────────── */}
            <div className="mt-auto border-t mx-5 pt-3 pb-4 space-y-2.5">
                {/* Deadline */}
                <div className="flex items-center justify-between">
                    <div
                        className={cn(
                            "flex items-center gap-1.5 text-xs",
                            overdue ? "text-rose-600 dark:text-rose-400 font-medium" : "text-muted-foreground"
                        )}
                    >
                        <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                        <span>
                            {overdue ? "⚠ متأخر — " : ""}
                            {formatDate(project.dueDate)}
                        </span>
                    </div>

                    {/* عدد المهام */}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <CheckSquare className="h-3.5 w-3.5" />
                        <span className="tabular-nums">{/* سيُربط بالـ API لاحقاً في Sprint 5 */}—</span>
                    </div>
                </div>

                {/* Owner + Members */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Avatar className="h-4 w-4">
                            <AvatarImage src={project.owner.avatarUrl ?? undefined} />
                            <AvatarFallback className="text-[8px]">{project.owner.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="truncate max-w-[80px]">{project.owner.name.split(" ")[0]}</span>
                    </div>

                    {project.memberIds.length > 0 && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Users className="h-3.5 w-3.5" />
                            <span>{project.memberIds.length}</span>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
