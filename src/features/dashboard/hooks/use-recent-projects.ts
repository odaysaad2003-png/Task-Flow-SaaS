import {useQuery} from "@tanstack/react-query";
import {dashboardApi} from "@/features/dashboard/services/dashboard.api";
import {queryKeys} from "@/lib/query-keys";

export function useRecentProjects() {
    return useQuery({
        queryKey: queryKeys.dashboard.recentProjects(),
        queryFn: dashboardApi.getRecent,
        staleTime: 30 * 1000,
        select: (response) => {
            // response هنا هو PaginatedResponse — نستخرج الـ data فقط
            // لكن api-client يستخرج json.data — وهي هنا ستكون { data: [], meta: {} }
            // لذا نتعامل معها كـ any ونستخرج الـ array
            const res = response as unknown as {data: typeof response; meta: unknown};
            return Array.isArray(res.data) ? res.data : (response as unknown as typeof res.data);
        },
    });
}
