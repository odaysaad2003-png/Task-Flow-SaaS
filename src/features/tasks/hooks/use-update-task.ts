import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import {taskApi} from "@/features/tasks/services/task.api";
import {queryKeys} from "@/lib/query-keys";
import {ApiClientError} from "@/lib/api-client";
import type {UpdateTaskInput} from "@/features/tasks/schemas/task.schema";

export function useUpdateTask(projectId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({id, data}: {id: string; data: UpdateTaskInput}) => taskApi.update(id, data),
        onSuccess: (updated) => {
            // تحديث الـ cache مباشرة لسرعة الاستجابة
            queryClient.setQueryData(queryKeys.tasks.detail(updated.id), updated);
            queryClient.invalidateQueries({
                queryKey: queryKeys.tasks.list({projectId}),
            });
            queryClient.invalidateQueries({
                queryKey: ["projects", projectId, "stats"],
            });
            toast.success("تم تحديث المهمة بنجاح");
        },
        onError: (error) => {
            if (error instanceof ApiClientError) toast.error(error.message);
            else toast.error("فشل تحديث المهمة");
        },
    });
}
