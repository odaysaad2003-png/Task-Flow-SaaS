import { apiClient } from "@/lib/api-client";
import type { PopulatedProject } from "@/features/projects/types/project.type";
import type { CreateProjectInput, UpdateProjectInput } from "@/features/projects/schemas/project.schema";

export interface ProjectFilters extends Record<string, string | number | boolean | undefined> {
    status?: string;
    clientId?: string;
    priority?: string;
    search?: string;
    page?: number;
    limit?: number;
}

export const projectApi = {
  getAll: (filters: ProjectFilters = {}) =>
    apiClient.getPaginated<PopulatedProject>("/api/projects", { params: filters }),

  getById: (id: string) =>
    apiClient.get<PopulatedProject>(`/api/projects/${id}`),

  create: (data: CreateProjectInput) =>
    apiClient.post<PopulatedProject>("/api/projects", data),

  update: (id: string, data: UpdateProjectInput) =>
    apiClient.patch<PopulatedProject>(`/api/projects/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<{ id: string }>(`/api/projects/${id}`),
};
