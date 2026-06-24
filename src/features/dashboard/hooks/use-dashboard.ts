import {useQueries} from "@tanstack/react-query";
import {dashboardApi} from "@/features/dashboard/services/dashboard.api";
import {queryKeys} from "@/lib/query-keys";

export function useDashboard() {
    // useQueries يُطلق الطلبين بالتوازي — لا ينتظر أحدهما الآخر
    const [statsQuery, recentQuery] = useQueries({
        queries: [
            {
                queryKey: queryKeys.dashboard.stats(),
                queryFn: dashboardApi.getStats,
                staleTime: 60 * 1000,
            },
            {
                queryKey: queryKeys.dashboard.recentProjects(),
                queryFn: dashboardApi.getRecent,
                staleTime: 30 * 1000,
            },
        ],
    });

    return {
        stats: statsQuery.data,
        recent: recentQuery.data,
        isLoading: statsQuery.isLoading || recentQuery.isLoading,
        isError: statsQuery.isError || recentQuery.isError,
        refetch: () => {
            statsQuery.refetch();
            recentQuery.refetch();
        },
    };
}
