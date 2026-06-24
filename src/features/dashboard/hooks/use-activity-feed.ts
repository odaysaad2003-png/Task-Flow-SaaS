"use client";

import {useDashboardStats} from "@/features/dashboard/hooks/use-dashboard-stats";

export function useActivityFeed() {
    const query = useDashboardStats();

    return {
        ...query,
        data: query.data?.completionRate,
    };
}
