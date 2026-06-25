import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import {taskApi} from "@/features/tasks/services/task.api";
import {queryKeys} from "@/lib/query-keys";
import {ApiClientError} from "@/lib/api-client";

export function useDeleteTask(projectId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: taskApi.delete,
        onSuccess: (_, deletedId) => {
            queryClient.removeQueries({queryKey: queryKeys.tasks.detail(deletedId)});
            queryClient.invalidateQueries({
                queryKey: queryKeys.tasks.list({projectId}),
            });
            queryClient.invalidateQueries({
                queryKey: ["projects", projectId, "stats"],
            });
            queryClient.invalidateQueries({queryKey: queryKeys.dashboard.all});
            toast.success("تم حذف المهمة بنجاح");
        },
        onError: (error) => {
            if (error instanceof ApiClientError) toast.error(error.message);
            else toast.error("فشل حذف المهمة");
        },
    });
}
