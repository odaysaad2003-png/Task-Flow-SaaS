"use client";

import {useEffect} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useQuery} from "@tanstack/react-query";
import {Loader2} from "lucide-react";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter} from "@/components/ui/dialog";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {createTaskSchema} from "@/features/tasks/schemas/task.schema";
import type {z} from "zod";

type TaskFormInput = z.input<typeof createTaskSchema>;
type TaskFormOutput = z.output<typeof createTaskSchema>;
import type {PopulatedTask} from "@/features/tasks/types/task.type";
import {useCreateTask} from "@/features/tasks/hooks/use-create-task";
import {useUpdateTask} from "@/features/tasks/hooks/use-update-task";
import {userApi} from "@/features/team/services/user.api";
import {TASK_STATUS_CONFIG, TASK_PRIORITY_CONFIG} from "@/features/tasks/constants/task.constants";

interface TaskFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    projectId: string;
    task?: PopulatedTask | null;
}

function toInputDate(dateStr?: string | null): string {
    if (!dateStr) return "";
    return new Date(dateStr).toISOString().split("T")[0];
}

export function TaskFormDialog({open, onOpenChange, projectId, task}: TaskFormDialogProps) {
    const isEditing = !!task;
    const createTask = useCreateTask(projectId);
    const updateTask = useUpdateTask(projectId);
    const isPending = createTask.isPending || updateTask.isPending;

    const {data: users} = useQuery({
        queryKey: ["users"],
        queryFn: userApi.getAll,
        staleTime: 5 * 60 * 1000,
        enabled: open,
    });

    const form = useForm<TaskFormInput, unknown, TaskFormOutput>({
        resolver: zodResolver(createTaskSchema),
        defaultValues: {
            title: "",
            description: "",
            status: "todo",
            priority: "medium",
            projectId,
            assigneeId: null,
            dueDate: null,
        },
    });

    useEffect(() => {
        if (open && task) {
            form.reset({
                title: task.title,
                description: task.description,
                status: task.status,
                priority: task.priority,
                projectId,
                assigneeId: task.assignee?.id ?? null,
                dueDate: toInputDate(task.dueDate),
            });
        } else if (open && !task) {
            form.reset({
                title: "",
                description: "",
                status: "todo",
                priority: "medium",
                projectId,
                assigneeId: null,
                dueDate: null,
            });
        }
    }, [open, task, form, projectId]);

    function onSubmit(data: TaskFormOutput) {
        const payload = {
            ...data,
            dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
        };

        if (isEditing) {
            updateTask.mutate({id: task.id, data: payload}, {onSuccess: () => onOpenChange(false)});
        } else {
            createTask.mutate(payload, {
                onSuccess: () => {
                    onOpenChange(false);
                    form.reset();
                },
            });
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "تعديل المهمة" : "إنشاء مهمة جديدة"}</DialogTitle>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-1">
                    {/* العنوان */}
                    <div className="space-y-1.5">
                        <Label htmlFor="title">عنوان المهمة *</Label>
                        <Input
                            id="title"
                            placeholder="مثال: تصميم صفحة تسجيل الدخول"
                            disabled={isPending}
                            {...form.register("title")}
                        />
                        {form.formState.errors.title && (
                            <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
                        )}
                    </div>

                    {/* الوصف */}
                    <div className="space-y-1.5">
                        <Label htmlFor="desc">الوصف</Label>
                        <Textarea
                            id="desc"
                            placeholder="تفاصيل إضافية عن المهمة..."
                            rows={2}
                            disabled={isPending}
                            {...form.register("description")}
                        />
                    </div>

                    {/* الحالة والأولوية */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label>الحالة *</Label>
                            <Select
                                value={form.watch("status")}
                                onValueChange={(v) => form.setValue("status", v as TaskFormInput["status"])}
                                disabled={isPending}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {(Object.entries(TASK_STATUS_CONFIG) as [string, {label: string}][]).map(
                                        ([key, val]) => (
                                            <SelectItem key={key} value={key}>
                                                {val.label}
                                            </SelectItem>
                                        )
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label>الأولوية *</Label>
                            <Select
                                value={form.watch("priority")}
                                onValueChange={(v) => form.setValue("priority", v as TaskFormInput["priority"])}
                                disabled={isPending}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {(Object.entries(TASK_PRIORITY_CONFIG) as [string, {label: string}][]).map(
                                        ([key, val]) => (
                                            <SelectItem key={key} value={key}>
                                                {val.label}
                                            </SelectItem>
                                        )
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* المسند إليه وتاريخ الاستحقاق */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label>المسند إليه</Label>
                            <Select
                                value={form.watch("assigneeId") ?? "none"}
                                onValueChange={(v) => form.setValue("assigneeId", v === "none" ? null : v)}
                                disabled={isPending}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="اختر عضواً" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">بدون إسناد</SelectItem>
                                    {users?.map((u) => (
                                        <SelectItem key={u.id} value={u.id}>
                                            {u.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="dueDate">تاريخ الاستحقاق</Label>
                            <Input id="dueDate" type="date" disabled={isPending} {...form.register("dueDate")} />
                        </div>
                    </div>

                    <DialogFooter className="pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isPending}
                        >
                            إلغاء
                        </Button>
                        <Button
                            type="submit"
                            className="bg-violet-600 hover:bg-violet-700 min-w-[100px]"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : isEditing ? (
                                "حفظ التعديلات"
                            ) : (
                                "إنشاء المهمة"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
