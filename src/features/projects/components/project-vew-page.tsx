"use client";

import {useState} from "react";
import {motion, AnimatePresence} from "framer-motion";
import {Plus, FolderKanban} from "lucide-react";
import {Button} from "@/components/ui/button";
import {ProjectFilters} from "@/features/projects/components/ProjectFilters";
import {ProjectCard} from "@/features/projects/components/ProjectCard";
import {ProjectFormDialog} from "@/features/projects/components/ProjectFormDialog";
import {DeleteProjectDialog} from "@/features/projects/components/DeleteProjectDialog";
import {Pagination} from "@/components/shared/Pagination";
import {EmptyState} from "@/components/shared/EmptyState";
import {ErrorState} from "@/components/shared/ErrorState";
import {ListPageSkeleton} from "@/components/shared/PageSkeleton";
import {useProjects} from "@/features/projects/hooks/use-projects";
import {usePermissions} from "@/features/auth/hooks/use-permissions";
import type {PopulatedProject} from "@/features/projects/types/project.type";

export default function ProjectsvewPage() {
    const {can} = usePermissions();

    // حالة الـ Dialogs — محلية لأنها UI State وليست Server State
    const [formOpen, setFormOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<PopulatedProject | null>(null);
    const [deletingProject, setDeletingProject] = useState<PopulatedProject | null>(null);

    const {data, isLoading, isError, refetch} = useProjects();

    // handlers — خارج الـ JSX دائماً
    function handleEdit(project: PopulatedProject) {
        setEditingProject(project);
        setFormOpen(true);
    }

    function handleDelete(project: PopulatedProject) {
        setDeletingProject(project);
    }

    function handleFormClose(open: boolean) {
        setFormOpen(open);
        if (!open) setEditingProject(null);
    }

    if (isLoading) return <ListPageSkeleton />;

    if (isError) {
        return <ErrorState title="تعذّر تحميل المشاريع" message="تحقق من اتصالك وأعد المحاولة" onRetry={refetch} />;
    }

    // استخراج البيانات من الـ response (PaginatedResponse)
    const projects = (data as unknown as {data: PopulatedProject[]})?.data ?? [];
    const meta = (data as unknown as {meta: {page: number; limit: number; total: number; totalPages: number}})?.meta;

    return (
        <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="space-y-6 max-w-7xl mx-auto">
            {/* ─── Header ─────────────────────────────── */}
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">المشاريع</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">{meta?.total ?? 0} مشروع إجمالاً</p>
                </div>

                {can("project:create") && (
                    <Button
                        className="gap-2 bg-violet-600 hover:bg-violet-700"
                        onClick={() => {
                            setEditingProject(null);
                            setFormOpen(true);
                        }}
                    >
                        <Plus className="h-4 w-4" />
                        مشروع جديد
                    </Button>
                )}
            </div>

            {/* ─── Filters ────────────────────────────── */}
            <ProjectFilters />

            {/* ─── Grid ───────────────────────────────── */}
            {projects.length === 0 ? (
                <EmptyState
                    icon={FolderKanban}
                    title="لا توجد مشاريع"
                    message={
                        can("project:create")
                            ? "لم يتم إنشاء أي مشاريع بعد. ابدأ بإنشاء مشروعك الأول!"
                            : "لا توجد مشاريع تطابق معايير الفلترة الحالية"
                    }
                    action={
                        can("project:create") ? {label: "إنشاء مشروع", onClick: () => setFormOpen(true)} : undefined
                    }
                />
            ) : (
                <AnimatePresence mode="popLayout">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {projects.map((project, i) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                index={i}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                </AnimatePresence>
            )}

            {/* ─── Pagination ─────────────────────────── */}
            {meta && <Pagination meta={meta} />}

            {/* ─── Dialogs ────────────────────────────── */}
            <ProjectFormDialog open={formOpen} onOpenChange={handleFormClose} project={editingProject} />

            <DeleteProjectDialog
                project={deletingProject}
                onOpenChange={(open) => {
                    if (!open) setDeletingProject(null);
                }}
            />
        </motion.div>
    );
}
