import {z} from "zod";

export const projectStatusSchema = z.enum(["planning", "active", "on-hold", "completed"]);

export const projectPrioritySchema = z.enum(["low", "medium", "high"]);

export const createProjectSchema = z.object({
    name: z.string().min(2, "اسم المشروع مطلوب"),

    description: z.string(),

    status: projectStatusSchema,

    priority: projectPrioritySchema,

    clientId: z.string().min(1, "العميل مطلوب"),

    memberIds: z.array(z.string()),

    startDate: z.string().min(1, "تاريخ البداية مطلوب"),

    dueDate: z.string().min(1, "تاريخ التسليم مطلوب"),
});

export const updateProjectSchema = createProjectSchema.partial();

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
