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
import {createProjectSchema, type CreateProjectInput} from "@/features/projects/schemas/project.schema";
import type {PopulatedProject} from "@/features/projects/types/project.type";
import {useCreateProject} from "@/features/projects/hooks/use-create-project";
import {useUpdateProject} from "@/features/projects/hooks/use-update-project";
import {clientApi} from "@/features/clients/services/client.api";
import {userApi} from "@/features/team/services/user.api";
import {queryKeys} from "@/lib/query-keys";

interface ProjectFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    project?: PopulatedProject | null; // null = إنشاء، object = تعديل
}

// دالة مساعدة لتحويل التاريخ لصيغة input[type=date]
function toInputDate(dateStr?: string): string {
    if (!dateStr) return "";
    return new Date(dateStr).toISOString().split("T")[0];
}

export function ProjectFormDialog({open, onOpenChange, project}: ProjectFormDialogProps) {
    const isEditing = !!project;

    const createMutation = useCreateProject();
    const updateMutation = useUpdateProject(project?.id ?? "");
    const isPending = createMutation.isPending || updateMutation.isPending;

    // جلب بيانات العملاء والمستخدمين للـ Select fields
    const {data: clients} = useQuery({
        queryKey: queryKeys.clients.list({}),
        queryFn: () => clientApi.getAll(),
        staleTime: 5 * 60 * 1000,
        enabled: open, // جلب فقط عند فتح الـ Dialog
    });
    // the users not use now
    //     // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //    const {data: users} =const { data: users } = useUsers({ enabled: open });
    // export function useUsers(options?: UseUsersOptions) {
    //     return useQuery({
    //         queryKey: queryKeys.users.list(),
    //         queryFn: userApi.getAll,
    //         staleTime: 5 * 60 * 1000,
    //         enabled: options?.enabled ?? true,
    //     });
    // }

    const form = useForm<CreateProjectInput>({
        resolver: zodResolver(createProjectSchema),
        defaultValues: {
            name: "",
            description: "",
            status: "planning",
            priority: "medium",
            clientId: "",
            memberIds: [],
            startDate: toInputDate(new Date().toISOString()),
            dueDate: "",
        },
    });

    // عند فتح الـ Dialog في وضع التعديل — اعبئ الفورم ببيانات المشروع
    useEffect(() => {
        if (open && project) {
            form.reset({
                name: project.name,
                description: project.description,
                status: project.status,
                priority: project.priority,
                clientId: project.client.id,
                memberIds: project.memberIds,
                startDate: toInputDate(project.startDate),
                dueDate: toInputDate(project.dueDate),
            });
        } else if (open && !project) {
            form.reset();
        }
    }, [open, project, form]);

    function onSubmit(data: CreateProjectInput) {
        const payload = {
            ...data,
            startDate: new Date(data.startDate).toISOString(),
            dueDate: new Date(data.dueDate).toISOString(),
        };

        if (isEditing) {
            updateMutation.mutate(payload, {
                onSuccess: () => onOpenChange(false),
            });
        } else {
            createMutation.mutate(payload, {
                onSuccess: () => {
                    onOpenChange(false);
                    form.reset();
                },
            });
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "تعديل المشروع" : "إنشاء مشروع جديد"}</DialogTitle>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
                    {/* ─── اسم المشروع ──────────────────── */}
                    <div className="space-y-1.5">
                        <Label htmlFor="name">اسم المشروع *</Label>
                        <Input
                            id="name"
                            placeholder="مثال: إعادة تصميم الموقع الإلكتروني"
                            disabled={isPending}
                            {...form.register("name")}
                        />
                        {form.formState.errors.name && (
                            <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
                        )}
                    </div>

                    {/* ─── الوصف ───────────────────────── */}
                    <div className="space-y-1.5">
                        <Label htmlFor="description">الوصف</Label>
                        <Textarea
                            id="description"
                            placeholder="وصف موجز للمشروع وأهدافه..."
                            rows={3}
                            disabled={isPending}
                            {...form.register("description")}
                        />
                    </div>

                    {/* ─── الحالة والأولوية ─────────────── */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label>الحالة *</Label>
                            <Select
                                value={form.watch("status")}
                                onValueChange={(v) => form.setValue("status", v as CreateProjectInput["status"])}
                                disabled={isPending}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="planning">تخطيط</SelectItem>
                                    <SelectItem value="active">نشط</SelectItem>
                                    <SelectItem value="on-hold">موقوف</SelectItem>
                                    <SelectItem value="completed">مكتمل</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label>الأولوية *</Label>
                            <Select
                                value={form.watch("priority")}
                                onValueChange={(v) => form.setValue("priority", v as CreateProjectInput["priority"])}
                                disabled={isPending}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">منخفضة</SelectItem>
                                    <SelectItem value="medium">متوسطة</SelectItem>
                                    <SelectItem value="high">عالية</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* ─── العميل ──────────────────────── */}
                    <div className="space-y-1.5">
                        <Label>العميل *</Label>
                        <Select
                            value={form.watch("clientId")}
                            onValueChange={(v) => form.setValue("clientId", v)}
                            disabled={isPending}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="اختر عميلاً..." />
                            </SelectTrigger>
                            <SelectContent>
                                {clients?.map((c) => (
                                    <SelectItem key={c.id} value={c.id}>
                                        {c.name} — {c.company}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {form.formState.errors.clientId && (
                            <p className="text-xs text-destructive">{form.formState.errors.clientId.message}</p>
                        )}
                    </div>

                    {/* ─── التواريخ ─────────────────────── */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="startDate">تاريخ البداية *</Label>
                            <Input id="startDate" type="date" disabled={isPending} {...form.register("startDate")} />
                            {form.formState.errors.startDate && (
                                <p className="text-xs text-destructive">{form.formState.errors.startDate.message}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="dueDate">تاريخ الانتهاء *</Label>
                            <Input id="dueDate" type="date" disabled={isPending} {...form.register("dueDate")} />
                            {form.formState.errors.dueDate && (
                                <p className="text-xs text-destructive">{form.formState.errors.dueDate.message}</p>
                            )}
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
                                "إنشاء المشروع"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
