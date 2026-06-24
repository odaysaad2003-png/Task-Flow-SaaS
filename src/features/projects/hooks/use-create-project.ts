import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import {projectApi} from "@/features/projects/services/project.api";
import {queryKeys} from "@/lib/query-keys";
import {ApiClientError} from "@/lib/api-client";

export function useCreateProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: projectApi.create,

        onSuccess: (newProject) => {
            // إلغاء كل قوائم المشاريع المخزّنة لإجبارها على إعادة الجلب
            queryClient.invalidateQueries({
                queryKey: queryKeys.projects.lists(),
            });
            // إلغاء الداشبورد لأن الأرقام تغيّرت
            queryClient.invalidateQueries({
                queryKey: queryKeys.dashboard.all,
            });
            toast.success(`تم إنشاء "${newProject.name}" بنجاح`);
        },

        onError: (error) => {
            if (error instanceof ApiClientError) {
                toast.error(error.message);
            } else {
                toast.error("فشل إنشاء المشروع، يرجى المحاولة مرة أخرى");
            }
        },
    });
}
