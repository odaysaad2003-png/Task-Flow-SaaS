"use client";

import {Loader2, AlertTriangle} from "lucide-react";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {Button} from "@/components/ui/button";
import {useDeleteProject} from "@/features/projects/hooks/use-delete-project";
import type {PopulatedProject} from "@/features/projects/types/project.type";

interface DeleteProjectDialogProps {
    project: PopulatedProject | null;
    onOpenChange: (open: boolean) => void;
}

export function DeleteProjectDialog({project, onOpenChange}: DeleteProjectDialogProps) {
    const {mutate: deleteProject, isPending} = useDeleteProject();

    function handleConfirm() {
        if (!project) return;
        deleteProject(project.id, {
            onSuccess: () => onOpenChange(false),
        });
    }

    return (
        <AlertDialog open={!!project} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                            <AlertTriangle className="h-5 w-5 text-destructive" />
                        </div>
                        <div>
                            <AlertDialogTitle>حذف المشروع</AlertDialogTitle>
                            <AlertDialogDescription className="mt-0.5">
                                هل أنت متأكد من حذف{" "}
                                <span className="font-semibold text-foreground">{project?.name}</span>؟ لا يمكن التراجع
                                عن هذا الإجراء.
                            </AlertDialogDescription>
                        </div>
                    </div>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>إلغاء</AlertDialogCancel>
                    <Button
                        variant="destructive"
                        onClick={handleConfirm}
                        disabled={isPending}
                        className="min-w-[100px]"
                    >
                        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "نعم، احذف"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
