import {useQuery} from "@tanstack/react-query";
import {useSearchParams} from "next/navigation";
import {queryKeys} from "@/lib/query-keys";
import {projectApi} from "@/features/projects/services/project.api";
import type {ProjectFilters} from "@/features/projects/services/project.api";

// Hook لجلب قائمة المشاريع
export function useProjects() {
    const searchParams = useSearchParams();

    const filters: ProjectFilters = {
        status: searchParams.get("status") ?? undefined,
        clientId: searchParams.get("clientId") ?? undefined,
        priority: searchParams.get("priority") ?? undefined,
        search: searchParams.get("search") ?? undefined,
        page: Number(searchParams.get("page") ?? "1"),
        limit: 9,
    };

    return useQuery({
        queryKey: queryKeys.projects.list(filters),
        queryFn: () => projectApi.getAll(filters),
        staleTime: 30 * 1000,
        placeholderData: (prev) => prev,
    });
}

// Hook لجلب مشروع واحد حسب id
export function useProject(id: string) {
    return useQuery({
        queryKey: queryKeys.projects.detail(id),
        queryFn: () => projectApi.getById(id),
        enabled: Boolean(id),
        staleTime: 30 * 1000,
    });
}
