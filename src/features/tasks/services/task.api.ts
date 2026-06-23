import { apiClient } from "@/lib/api-client";
import type { PopulatedTask } from "@/features/tasks/types/task.type";
import type { CreateTaskInput, UpdateTaskInput } from "@/features/tasks/schemas/task.schema";

export interface TaskFilters extends Record<string, string | number | boolean | undefined> {
    status?: string;
    projectId?: string;
    assigneeId?: string;
    page?: number;
    limit?: number;
}

export const taskApi = {
  getAll: (filters: TaskFilters = {}) =>
    apiClient.get<PopulatedTask[]>("/api/tasks", { params: filters }),

  getById: (id: string) =>
    apiClient.get<PopulatedTask>(`/api/tasks/${id}`),

  create: (data: CreateTaskInput) =>
    apiClient.post<PopulatedTask>("/api/tasks", data),

  update: (id: string, data: UpdateTaskInput) =>
    apiClient.patch<PopulatedTask>(`/api/tasks/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<{ id: string }>(`/api/tasks/${id}`),

  changeStatus: (id: string, status: PopulatedTask["status"]) =>
    apiClient.patch<PopulatedTask>(`/api/tasks/${id}`, { status }),
};
