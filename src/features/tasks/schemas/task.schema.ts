
import {z} from "zod";

export const createTaskSchema = z.object({
    title: z.string().min(3, "عنوان المهمة يجب أن يكون 3 أحرف على الأقل").max(200, "العنوان طويل جدًا"),
    description: z.string().max(1000, "الوصف طويل جدًا").default(""),
    status: z.enum(["todo", "in-progress", "review", "done"]).default("todo"),
    priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
    projectId: z.string().min(1, "المشروع مطلوب"),
    assigneeId: z.string().nullable().default(null),
    dueDate: z.string().nullable().default(null),
});

export const updateTaskSchema = createTaskSchema.partial();

export const changeTaskStatusSchema = z.object({
    status: z.enum(["todo", "in-progress", "review", "done"]),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type ChangeTaskStatusInput = z.infer<typeof changeTaskStatusSchema>;