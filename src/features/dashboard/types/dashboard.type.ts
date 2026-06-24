import type {PopulatedProject} from "@/features/projects/types/project.type";
import type {PopulatedTask} from "@/features/tasks/types/task.type";
import type {PopulatedActivityLog} from "@/features/activity/types/activity.type";
import type {ProjectStatus} from "@/features/projects/types/project.type";
import type {TaskStatus} from "@/features/tasks/types/task.type";

export interface DashboardStats {
    projects: {
        total: number;
        active: number;
        completed: number;
    };
    tasks: {
        total: number;
        myTasks: number;
        overdue: number;
        byStatus: {
            todo: number;
            "in-progress": number;
            review: number;
            done: number;
        };
    };
    completionRate: number;
    totalClients: number;
    totalMembers: number;
}

export interface DashboardData {
    stats: DashboardStats;
    statCards: DashboardStat[];
    taskStatus: TaskStatusMetric[];
    projectStatus: ProjectStatusMetric[];
    recentProjects: PopulatedProject[];
    recentTasks: PopulatedTask[];
    activityFeed: PopulatedActivityLog[];
}

export type StatTrend = "up" | "down" | "neutral";

export interface StatCardConfig {
    id: string;
    label: string;
    getValue: (stats: DashboardStats) => number;
    description: string;
    trend?: StatTrend;
    color: "violet" | "blue" | "emerald" | "amber" | "rose";
    suffix?: string;
}

export interface DashboardStat {
    id: "projects" | "tasks" | "clients" | "overdue";
    label: string;
    value: number;
    helper: string;
    trend?: {
        value: string;
        direction: StatTrend;
    };
}

export interface TaskStatusMetric {
    status: TaskStatus;
    label: string;
    count: number;
}

export interface ProjectStatusMetric {
    status: ProjectStatus;
    label: string;
    count: number;
}
export interface DashboardRecent {
    recentProjects: PopulatedProject[];
    recentTasks: PopulatedTask[];
    activityFeed: PopulatedActivityLog[];
    myTasks: PopulatedTask[];
}