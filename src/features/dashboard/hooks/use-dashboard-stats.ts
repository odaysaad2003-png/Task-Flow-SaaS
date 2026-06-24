import {useQuery} from "@tanstack/react-query";
import {dashboardApi} from "@/features/dashboard/services/dashboard.api";
import {queryKeys} from "@/lib/query-keys";

export function useDashboardStats() {
    return useQuery({
        queryKey: queryKeys.dashboard.stats(),
        queryFn: dashboardApi.getStats,
        staleTime: 60 * 1000, // دقيقة كاملة — الإحصائيات لا تتغير بسرعة
        refetchOnWindowFocus: true,
    });
}
