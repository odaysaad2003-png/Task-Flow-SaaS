
import {z} from "zod";

export const createCommentSchema = z.object({
    content: z.string().min(1, "التعليق لا يمكن أن يكون فارغًا").max(1000, "التعليق طويل جدًا"),
    taskId: z.string().min(1, "معرّف المهمة مطلوب"),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>; 