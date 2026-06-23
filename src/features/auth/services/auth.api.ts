import {apiClient} from "@/lib/api-client";
import type {AuthSession, User} from "@/features/auth/types/auth.type";
import type {LoginInput} from "@/features/auth/schemas/auth.schema";

export const authApi = {
    login: (data: LoginInput) => apiClient.post<AuthSession>("/api/auth/login", data),

    logout: () => apiClient.post<{success: boolean}>("/api/auth/logout", {}),

    getMe: () => apiClient.get<User>("/api/auth/me"),
};
