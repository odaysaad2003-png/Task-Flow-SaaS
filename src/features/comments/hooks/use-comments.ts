import {useQuery} from "@tanstack/react-query";
import {commentApi} from "@/features/comments/services/comment.api";

export function useComments(taskId: string) {
    return useQuery({
        queryKey: ["comments", "task", taskId],
        queryFn: () => commentApi.getByTask(taskId),
        staleTime: 20 * 1000,
        enabled: !!taskId,
    });
}
