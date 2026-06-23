
import {apiClient} from "@/lib/api-client";
import type {PopulatedComment} from "@/features/comments/types/comment.type";
import type {CreateCommentInput} from "@/features/comments/schemas/comment.schema";

export const commentApi = {
    getByTask: (taskId: string) => apiClient.get<PopulatedComment[]>("/api/comments", {params: {taskId}}),

    create: (data: CreateCommentInput) => apiClient.post<PopulatedComment>("/api/comments", data),

    delete: (id: string) => apiClient.delete<{id: string}>(`/api/comments/${id}`),
};