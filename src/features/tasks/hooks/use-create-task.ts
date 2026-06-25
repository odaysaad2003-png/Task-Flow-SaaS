import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import {taskApi} from "@/features/tasks/services/task.api";
import {queryKeys} from "@/lib/query-keys";
import {ApiClientError} from "@/lib/api-client";

export function useCreateTask(projectId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: taskApi.create,
        onSuccess: (newTask) => {
            // إلغاء قائمة المهام الخاصة بهذا المشروع
            queryClient.invalidateQueries({
                queryKey: queryKeys.tasks.list({projectId}),
            });
            // إلغاء إحصائيات المشروع لأن العداد تغيّر
            queryClient.invalidateQueries({
                queryKey: ["projects", projectId, "stats"],
            });
            // إلغاء الداشبورد
            queryClient.invalidateQueries({queryKey: queryKeys.dashboard.all});
            toast.success(`تم إنشاء "${newTask.title}" بنجاح`);
        },
        onError: (error) => {
            if (error instanceof ApiClientError) toast.error(error.message);
            else toast.error("فشل إنشاء المهمة");
        },
    });
}
