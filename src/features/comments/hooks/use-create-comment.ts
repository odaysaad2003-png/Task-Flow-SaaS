import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import {commentApi} from "@/features/comments/services/comment.api";
import {ApiClientError} from "@/lib/api-client";
import type {PopulatedComment} from "@/features/comments/types/comment.type";

export function useCreateComment(taskId: string) {
    const queryClient = useQueryClient();
    const queryKey = ["comments", "task", taskId];

    return useMutation({
        mutationFn: commentApi.create,

        // ─── Optimistic Update ───────────────────────────────────────────
        onMutate: async (newCommentData) => {
            // إلغاء أي refetch جارٍ لتجنب تعارض البيانات
            await queryClient.cancelQueries({queryKey});

            // حفظ البيانات القديمة للـ Rollback عند الفشل
            const previousComments = queryClient.getQueryData<PopulatedComment[]>(queryKey);

            // إضافة التعليق المؤقت للـ cache مباشرة
            const optimisticComment: PopulatedComment = {
                id: `temp_${Date.now()}`,
                content: newCommentData.content,
                taskId,
                createdAt: new Date().toISOString(),
                author: {
                    id: "u1",
                    name: "أنت",
                    avatarUrl: null,
                },
            };

            queryClient.setQueryData<PopulatedComment[]>(queryKey, (old = []) => [...old, optimisticComment]);

            // إرجاع السياق للـ Rollback
            return {previousComments};
        },

        // ─── عند النجاح: استبدال التعليق المؤقت بالحقيقي ────────────────
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey});
        },

        // ─── عند الفشل: Rollback للبيانات القديمة ────────────────────────
        onError: (error, _variables, context) => {
            if (context?.previousComments !== undefined) {
                queryClient.setQueryData(queryKey, context.previousComments);
            }
            if (error instanceof ApiClientError) toast.error(error.message);
            else toast.error("فشل إرسال التعليق");
        },
    });
}
