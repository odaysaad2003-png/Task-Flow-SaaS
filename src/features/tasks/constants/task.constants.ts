import type { TaskStatus, TaskPriority } from "@/features/tasks/types/task.type";

export const TASK_STATUS_CONFIG: Record<TaskStatus, {label: string; color: string; bg: string; border: string; dot: string}> =
    {
        todo: {
            label: "للتنفيذ",
            color: "text-slate-600 dark:text-slate-400",
            bg: "bg-slate-50 dark:bg-slate-900/40",
            border: "border-slate-200 dark:border-slate-800",
            dot: "bg-slate-400",
        },
        "in-progress": {
            label: "جارٍ",
            color: "text-blue-700 dark:text-blue-400",
            bg: "bg-blue-50 dark:bg-blue-950/40",
            border: "border-blue-200 dark:border-blue-900/50",
            dot: "bg-blue-500",
        },
        review: {
            label: "مراجعة",
            color: "text-amber-700 dark:text-amber-400",
            bg: "bg-amber-50 dark:bg-amber-950/40",
            border: "border-amber-200 dark:border-amber-900/50",
            dot: "bg-amber-500",
        },
        done: {
            label: "مكتمل",
            color: "text-emerald-700 dark:text-emerald-400",
            bg: "bg-emerald-50 dark:bg-emerald-950/40",
            border: "border-emerald-200 dark:border-emerald-900/50",
            dot: "bg-emerald-500",
        },
    };

export const TASK_PRIORITY_CONFIG: Record <TaskPriority, { label: string; color: string; bg: string }> = {
  low: {
    label: "منخفضة",
    color: "text-slate-600 dark:text-slate-400",
    bg: "bg-slate-100 dark:bg-slate-800",
  },
  medium: {
    label: "متوسطة",
    color: "text-blue-700 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950",
  },
  high: {
    label: "عالية",
    color: "text-amber-700 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950",
  },
  urgent: {
    label: "عاجلة",
    color: "text-rose-700 dark:text-rose-400",
    bg: "bg-rose-50 dark:bg-rose-950",
  },
};

export const TASK_STATUS_OPTIONS: { value: TaskStatus | "all"; label: string }[] = [
  { value: "all", label: "كل الحالات" },
  { value: "todo", label: "للتنفيذ" },
  { value: "in-progress", label: "جارٍ" },
  { value: "review", label: "مراجعة" },
  { value: "done", label: "مكتمل" },
];

export const TASK_PRIORITY_OPTIONS: { value: TaskPriority | "all"; label: string }[] = [
  { value: "all", label: "كل الأولويات" },
  { value: "urgent", label: "عاجلة" },
  { value: "high", label: "عالية" },
  { value: "medium", label: "متوسطة" },
  { value: "low", label: "منخفضة" },
];