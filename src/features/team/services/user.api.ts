import {apiClient} from "@/lib/api-client";
import type {User} from "@/features/auth/types/auth.type";

export const userApi = {
    getAll: () => apiClient.get<Pick<User, "id" | "name" | "email" | "avatarUrl" | "role">[]>("/api/users"),
};
