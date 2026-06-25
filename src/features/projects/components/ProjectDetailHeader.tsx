"use client";

import {useState} from "react";
import Link from "next/link";
import {ChevronRight, Pencil, Trash2, MoreHorizontal} from "lucide-react";
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
import {ProjectFormDialog} from "./ProjectFormDialog";
import {DeleteProjectDialog} from "./DeleteProjectDialog";
import type {PopulatedProject} from "@/features/projects/types/project.type";
import {usePermissions} from "@/features/auth/hooks/use-permissions";

interface ProjectDetailHeaderProps {
    project: PopulatedProject;
}

export function ProjectDetailHeader({project}: ProjectDetailHeaderProps) {
    const {can} = usePermissions();
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    return (
        <>
            <div className="space-y-4">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Link href="/projects" className="hover:text-foreground transition-colors">
                        المشاريع
                    </Link>
                    <ChevronRight className="h-4 w-4" />
                    <span className="text-foreground font-medium truncate max-w-[200px]">{project.name}</span>
                </nav>

                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1 min-w-0">
                        <h1 className="text-2xl font-bold tracking-tight truncate">{project.name}</h1>
                        <div className="flex items-center gap-2 flex-wrap">
                            <ProjectStatusBadge status={project.status} />
                            <ProjectPriorityBadge priority={project.priority} />
                            <span className="text-xs text-muted-foreground">{project.client.company}</span>
                        </div>
                    </div>

                    {/* Actions */}
                    {(can("project:create") || can("project:delete")) && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="gap-2 shrink-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                    إجراءات
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                                {can("project:create") && (
                                    <DropdownMenuItem onClick={() => setEditOpen(true)}>
                                        <Pencil className="ml-2 h-3.5 w-3.5" />
                                        تعديل المشروع
                                    </DropdownMenuItem>
                                )}
                                {can("project:delete") && (
                                    <>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            className="text-destructive focus:text-destructive"
                                            onClick={() => setDeleteOpen(true)}
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
            </div>

            {/* Dialogs */}
            <ProjectFormDialog open={editOpen} onOpenChange={setEditOpen} project={project} />
            <DeleteProjectDialog project={deleteOpen ? project : null} onOpenChange={(open) => setDeleteOpen(open)} />
        </>
    );
}
