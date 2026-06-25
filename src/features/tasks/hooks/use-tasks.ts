import {useQuery} from "@tanstack/react-query";
import {queryKeys} from "@/lib/query-keys";
import {taskApi} from "@/features/tasks/services/task.api";
import type {TaskFilters} from "@/features/tasks/services/task.api";

export function useTasks(filters: TaskFilters = {}) {
    return useQuery({
        queryKey: queryKeys.tasks.list(filters),
        queryFn: () => taskApi.getAll(filters),
        staleTime: 30 * 1000,
        // لا تستدعي إذا لم يكن هناك projectId في السياق المطلوب
        enabled: filters.projectId !== undefined ? !!filters.projectId : true,
    });
}
