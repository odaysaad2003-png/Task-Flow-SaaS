
import {z} from "zod";

export const createProjectSchema = z.object({
    name: z.string().min(3, "اسم المشروع يجب أن يكون 3 أحرف على الأقل").max(100, "اسم المشروع طويل جدًا"),
    description: z.string().max(500, "الوصف طويل جدًا").default(""),
    status: z.enum(["planning", "active", "on-hold", "completed"]),
    priority: z.enum(["low", "medium", "high"]),
    clientId: z.string().min(1, "اختر عميلاً"),
    memberIds: z.array(z.string()).default([]),
    startDate: z.string().min(1, "تاريخ البداية مطلوب"),
    dueDate: z.string().min(1, "تاريخ الانتهاء مطلوب"),
});

export const updateProjectSchema = createProjectSchema.partial();

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;