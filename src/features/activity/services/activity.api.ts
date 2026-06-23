import {apiClient} from "@/lib/api-client";
import type {PopulatedActivityLog} from "@/features/activity/types/activity.type";

export const activityApi = {
    getAll: (filters: {entityType?: string; entityId?: string; limit?: number} = {}) =>
        apiClient.get<PopulatedActivityLog[]>("/api/activity", {params: filters}),
};
