"use client";

import {useDashboardStats} from "@/features/dashboard/hooks/use-dashboard-stats";

export function useRecentTasks() {
    const query = useDashboardStats();

    return {
        ...query,
        data: query.data?.tasks,
    };
}
