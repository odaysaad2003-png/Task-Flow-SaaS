import {apiClient} from "@/lib/api-client";
import type {Client} from "@/features/clients/types/client.type";
import type {CreateClientInput, UpdateClientInput} from "@/features/clients/schemas/client.schema";

export const clientApi = {
    getAll: (filters: {search?: string; status?: string} = {}) =>
        apiClient.get<Client[]>("/api/clients", {params: filters}),

    getById: (id: string) => apiClient.get<Client>(`/api/clients/${id}`),

    create: (data: CreateClientInput) => apiClient.post<Client>("/api/clients", data),

    update: (id: string, data: UpdateClientInput) => apiClient.patch<Client>(`/api/clients/${id}`, data),

    delete: (id: string) => apiClient.delete<{id: string}>(`/api/clients/${id}`),
};
