import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import {commentApi} from "@/features/comments/services/comment.api";
import {ApiClientError} from "@/lib/api-client";
import type {PopulatedComment} from "@/features/comments/types/comment.type";

export function useDeleteComment(taskId: string) {
    const queryClient = useQueryClient();
    const queryKey = ["comments", "task", taskId];

    return useMutation({
        mutationFn: commentApi.delete,

        onMutate: async (commentId) => {
            await queryClient.cancelQueries({queryKey});
            const previous = queryClient.getQueryData<PopulatedComment[]>(queryKey);

            // إزالة التعليق فوراً من الـ UI
            queryClient.setQueryData<PopulatedComment[]>(queryKey, (old = []) => old.filter((c) => c.id !== commentId));

            return {previous};
        },

        onError: (error, _id, context) => {
            if (context?.previous !== undefined) {
                queryClient.setQueryData(queryKey, context.previous);
            }
            if (error instanceof ApiClientError) toast.error(error.message);
            else toast.error("فشل حذف التعليق");
        },

        onSettled: () => {
            // تزامن نهائي بعد النجاح أو الفشل
            queryClient.invalidateQueries({queryKey});
        },
    });
}
