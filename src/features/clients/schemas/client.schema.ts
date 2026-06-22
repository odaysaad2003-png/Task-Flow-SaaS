
import {z} from "zod";

export const createClientSchema = z.object({
    name: z.string().min(2, "الاسم مطلوب"),
    company: z.string().min(2, "اسم الشركة مطلوب"),
    email: z.string().email("البريد الإلكتروني غير صحيح"),
    phone: z.string().nullable().default(null),
    status: z.enum(["active", "inactive"]).default("active"),
});

export const updateClientSchema = createClientSchema.partial();

export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;