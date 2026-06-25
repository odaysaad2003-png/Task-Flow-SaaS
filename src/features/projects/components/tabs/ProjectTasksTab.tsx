"use client";

import {useState} from "react";
import {motion, AnimatePresence} from "framer-motion";
import {Plus, CheckSquare, Pencil, Trash2, CalendarDays} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Skeleton} from "@/components/ui/skeleton";
import {TaskStatusSelect} from "@/features/tasks/components/TaskStatusSelect";
import {TaskStatusBadge} from "@/features/tasks/components/TaskStatusBadge";
import {TaskFormDialog} from "@/features/tasks/components/TaskFormDialog";
import {EmptyState} from "@/components/shared/EmptyState";
import {ErrorState} from "@/components/shared/ErrorState";
import {useTasks} from "@/features/tasks/hooks/use-tasks";
import {useUpdateTask} from "@/features/tasks/hooks/use-update-task";
import {useDeleteTask} from "@/features/tasks/hooks/use-delete-task";
import {usePermissions} from "@/features/auth/hooks/use-permissions";
import type {PopulatedTask, TaskStatus} from "@/features/tasks/types/task.type";
import {TASK_PRIORITY_CONFIG} from "@/features/tasks/constants/task.constants";
import {cn} from "@/lib/utils";

interface ProjectTasksTabProps {
    projectId: string;
}

function TaskRowSkeleton() {
    return (
        <div className="flex items-center gap-3 p-3 animate-pulse">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-16" />
        </div>
    );
}

function TaskRow({
    task,
    projectId,
    onEdit,
}: {
    task: PopulatedTask;
    projectId: string;
    onEdit: (task: PopulatedTask) => void;
}) {
    const {can} = usePermissions();
    const updateTask = useUpdateTask(projectId);
    const deleteTask = useDeleteTask(projectId);

    function handleStatusChange(status: TaskStatus) {
        updateTask.mutate({id: task.id, data: {status}});
    }

    const priorityConfig = TASK_PRIORITY_CONFIG[task.priority];
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "done";

    return (
        <motion.div
            layout
            initial={{opacity: 0, x: -8}}
            animate={{opacity: 1, x: 0}}
            exit={{opacity: 0, x: 8, scale: 0.98}}
            transition={{duration: 0.25}}
            className={cn(
                "group flex items-center gap-3 rounded-xl border px-4 py-3",
                "hover:border-border/80 hover:bg-muted/40 transition-all duration-200",
                task.status === "done" && "opacity-60"
            )}
        >
            {/* الحالة — قابلة للتغيير مباشرة */}
            <TaskStatusSelect value={task.status} onChange={handleStatusChange} disabled={!can("task:create")} />

            {/* عنوان المهمة */}
            <div className="flex-1 min-w-0">
                <p
                    className={cn(
                        "text-sm font-medium truncate",
                        task.status === "done" && "line-through text-muted-foreground"
                    )}
                >
                    {task.title}
                </p>
                {task.description && (
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{task.description}</p>
                )}
            </div>

            {/* الأولوية */}
            <span
                className={cn(
                    "hidden sm:inline-flex shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-md",
                    priorityConfig.bg,
                    priorityConfig.color
                )}
            >
                {priorityConfig.label}
            </span>

            {/* تاريخ الاستحقاق */}
            {task.dueDate && (
                <div
                    className={cn(
                        "hidden md:flex items-center gap-1 text-[11px] shrink-0",
                        isOverdue ? "text-rose-600 font-medium" : "text-muted-foreground"
                    )}
                >
                    <CalendarDays className="h-3.5 w-3.5" />
                    {new Date(task.dueDate).toLocaleDateString("ar-SA", {
                        month: "short",
                        day: "numeric",
                    })}
                </div>
            )}

            {/* المسند إليه */}
            {task.assignee && (
                <Avatar className="h-6 w-6 shrink-0">
                    <AvatarImage src={task.assignee.avatarUrl ?? undefined} />
                    <AvatarFallback className="text-[10px]">{task.assignee.name[0]}</AvatarFallback>
                </Avatar>
            )}

            {/* Actions */}
            {can("task:create") && (
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        onClick={() => onEdit(task)}
                    >
                        <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    {can("task:delete") && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            onClick={() => deleteTask.mutate(task.id)}
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                    )}
                </div>
            )}
        </motion.div>
    );
}

export function ProjectTasksTab({projectId}: ProjectTasksTabProps) {
    const {can} = usePermissions();
    const [formOpen, setFormOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<PopulatedTask | null>(null);

    const {data: tasks, isLoading, isError, refetch} = useTasks({projectId});

    function handleEdit(task: PopulatedTask) {
        setEditingTask(task);
        setFormOpen(true);
    }

    function handleFormClose(open: boolean) {
        setFormOpen(open);
        if (!open) setEditingTask(null);
    }

    if (isError) {
        return <ErrorState message="تعذّر تحميل المهام" onRetry={refetch} />;
    }

    return (
        <motion.div
            initial={{opacity: 0, y: 8}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.3}}
            className="space-y-4"
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{isLoading ? "..." : `${tasks?.length ?? 0} مهمة`}</p>
                {can("task:create") && (
                    <Button
                        size="sm"
                        className="gap-1.5 bg-violet-600 hover:bg-violet-700"
                        onClick={() => {
                            setEditingTask(null);
                            setFormOpen(true);
                        }}
                    >
                        <Plus className="h-3.5 w-3.5" />
                        مهمة جديدة
                    </Button>
                )}
            </div>

            {/* List */}
            {isLoading ? (
                <div className="space-y-2">
                    {Array.from({length: 5}).map((_, i) => (
                        <TaskRowSkeleton key={i} />
                    ))}
                </div>
            ) : !tasks?.length ? (
                <EmptyState
                    icon={CheckSquare}
                    title="لا توجد مهام في هذا المشروع"
                    message={
                        can("task:create")
                            ? "ابدأ بإضافة مهامك الأولى لهذا المشروع"
                            : "لم يتم إضافة مهام لهذا المشروع بعد"
                    }
                    action={can("task:create") ? {label: "إضافة مهمة", onClick: () => setFormOpen(true)} : undefined}
                />
            ) : (
                <div className="space-y-2">
                    <AnimatePresence mode="popLayout">
                        {tasks.map((task) => (
                            <TaskRow key={task.id} task={task} projectId={projectId} onEdit={handleEdit} />
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Dialog */}
            <TaskFormDialog open={formOpen} onOpenChange={handleFormClose} projectId={projectId} task={editingTask} />
        </motion.div>
    );
}
