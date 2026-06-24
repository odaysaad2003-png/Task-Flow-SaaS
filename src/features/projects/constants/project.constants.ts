import type { ProjectStatus, ProjectPriority } from "@/features/projects/types/project.type";

export const PROJECT_STATUS_CONFIG: Record < ProjectStatus,{ label: string; color: string; bg: string; dot: string }> = {
        planning: {
            label: "تخطيط",
            color: "text-slate-600 dark:text-slate-400",
            bg: "bg-slate-100 dark:bg-slate-800",
            dot: "bg-slate-400",
        },
        active: {
            label: "نشط",
            color: "text-emerald-700 dark:text-emerald-400",
            bg: "bg-emerald-50 dark:bg-emerald-950/60",
            dot: "bg-emerald-500",
        },
        "on-hold": {
            label: "موقوف",
            color: "text-amber-700 dark:text-amber-400",
            bg: "bg-amber-50 dark:bg-amber-950/60",
            dot: "bg-amber-500",
        },
        completed: {
            label: "مكتمل",
            color: "text-blue-700 dark:text-blue-400",
            bg: "bg-blue-50 dark:bg-blue-950/60",
            dot: "bg-blue-500",
        },
    };

export const PROJECT_PRIORITY_CONFIG: Record< ProjectPriority, {label: string; color: string; bg: string}> = {
    low: {
        label: "منخفضة",
        color: "text-slate-600 dark:text-slate-400",
        bg: "bg-slate-100 dark:bg-slate-800",
    },
    medium: {
        label: "متوسطة",
        color: "text-blue-700 dark:text-blue-400",
        bg: "bg-blue-50 dark:bg-blue-950/60",
    },
    high: {
        label: "عالية",
        color: "text-rose-700 dark:text-rose-400",
        bg: "bg-rose-50 dark:bg-rose-950/60",
    },
};

export const STATUS_OPTIONS: { value: ProjectStatus | "all"; label: string }[] = [
  { value: "all", label: "كل الحالات" },
  { value: "active", label: "نشط" },
  { value: "planning", label: "تخطيط" },
  { value: "on-hold", label: "موقوف" },
  { value: "completed", label: "مكتمل" },
];

export const PRIORITY_OPTIONS: { value: ProjectPriority | "all"; label: string }[] = [
  { value: "all", label: "كل الأولويات" },
  { value: "high", label: "عالية" },
  { value: "medium", label: "متوسطة" },
  { value: "low", label: "منخفضة" },
];