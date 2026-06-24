import {apiClient} from "@/lib/api-client";
import type {DashboardRecent, DashboardStats} from "@/features/dashboard/types/dashboard.type";



export const dashboardApi = {
    getStats: () => apiClient.get<DashboardStats>("/api/dashboard/stats"),

    getRecent: () => apiClient.get<DashboardRecent>("/api/dashboard/recent"),
};
