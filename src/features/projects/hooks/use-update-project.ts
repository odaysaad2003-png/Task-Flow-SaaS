import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import {projectApi} from "@/features/projects/services/project.api";
import {queryKeys} from "@/lib/query-keys";
import {ApiClientError} from "@/lib/api-client";
import type {UpdateProjectInput} from "@/features/projects/schemas/project.schema";

export function useUpdateProject(id: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateProjectInput) => projectApi.update(id, data),

        onSuccess: (updatedProject) => {
            // تحديث الـ cache مباشرة بدون إعادة جلب — أسرع للمستخدم
            queryClient.setQueryData(queryKeys.projects.detail(id), updatedProject);
            // إلغاء القوائم لتعكس التعديل فيها
            queryClient.invalidateQueries({
                queryKey: queryKeys.projects.lists(),
            });
            toast.success(`تم تحديث "${updatedProject.name}" بنجاح`);
        },

        onError: (error) => {
            if (error instanceof ApiClientError) {
                toast.error(error.message);
            } else {
                toast.error("فشل تحديث المشروع");
            }
        },
    });
}
