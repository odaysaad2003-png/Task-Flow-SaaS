import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import {projectApi} from "@/features/projects/services/project.api";
import {queryKeys} from "@/lib/query-keys";
import {ApiClientError} from "@/lib/api-client";

export function useDeleteProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: projectApi.delete,

        onSuccess: (_, deletedId) => {
            // إزالة الـ cache الخاص بهذا المشروع فوراً
            queryClient.removeQueries({
                queryKey: queryKeys.projects.detail(deletedId),
            });
            // إلغاء كل القوائم
            queryClient.invalidateQueries({
                queryKey: queryKeys.projects.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: queryKeys.dashboard.all,
            });
            toast.success("تم حذف المشروع بنجاح");
        },

        onError: (error) => {
            if (error instanceof ApiClientError) {
                toast.error(error.message);
            } else {
                toast.error("فشل حذف المشروع");
            }
        },
    });
}
