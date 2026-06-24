export const queryKeys = {
    projects: {
        all: ["projects"] as const,
        lists: () => [...queryKeys.projects.all, "list"] as const,
        list: (filters: Record<string, unknown>) => [...queryKeys.projects.lists(), filters] as const,
        details: () => [...queryKeys.projects.all, "detail"] as const,
        detail: (id: string) => [...queryKeys.projects.details(), id] as const,
    },
    tasks: {
        all: ["tasks"] as const,
        lists: () => [...queryKeys.tasks.all, "list"] as const,
        list: (filters: Record<string, unknown>) => [...queryKeys.tasks.lists(), filters] as const,
        detail: (id: string) => [...queryKeys.tasks.all, "detail", id] as const,
    },
    clients: {
        all: ["clients"] as const,
        lists: () => [...queryKeys.clients.all, "list"] as const,
        detail: (id: string) => [...queryKeys.clients.all, "detail", id] as const,
    },
    dashboard: {
        all: ["dashboard"] as const,
        stats: () => [...queryKeys.dashboard.all, "stats"] as const,
        recentProjects: () => [...queryKeys.dashboard.all, "recent-projects"] as const,
        recentTasks: () => [...queryKeys.dashboard.all, "recent-tasks"] as const,
        activityFeed: () => [...queryKeys.dashboard.all, "activity-feed"] as const,
    },
    // سنكمل users, comments, activity, dashboard في الـ Sprints القادمة عند الحاجة
} as const;
